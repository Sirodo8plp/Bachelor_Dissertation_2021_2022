import axios from "axios";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { IPINFO_KEY } from "../constants";
import { Photograph } from "../entities/Photograph";
import { uploadInputs } from "../inputTypes/uploadInputs";
import { ipInfoData } from "../interfaces/ipInfoData";
import { PhotographReturnType } from "../objectTypes/PhotographReturnType";
import { LocationRepository } from "../repositories/locationRepo";
import { PhotographRepository } from "../repositories/photographRepo";
import { UserRepository } from "../repositories/userRepo";
import { DbContext } from "../types";

@Resolver()
export class PhotographResolver {
  PhotographRepository =
    getConnection().getCustomRepository(PhotographRepository);
  UserRepository = getConnection().getCustomRepository(UserRepository);
  LocationRepository = getConnection().getCustomRepository(LocationRepository);

  @Query(() => [Photograph])
  async getPhotographs(): Promise<Photograph[]> {
    return await this.PhotographRepository.findAllPhotographs();
  }

  @Query(() => PhotographReturnType, { nullable: true })
  async getUserPhotographs(@Ctx() { req }: DbContext) {
    if (!req || !req!.session || !req.session!.userId) {
      return null;
    }
    const images =
      await this.PhotographRepository.getFirstUserPhotographsAndCount(
        req.session.userId
      );
    return {
      images: images,
    };
  }

  @Mutation(() => String)
  async removePhotograph(@Arg("id") id: number): Promise<string> {
    await getConnection().getRepository(Photograph).delete({ id: id });
    return "success";
  }

  @Mutation(() => String)
  async deleteAllPhotographs() {
    await this.PhotographRepository.removeAll();
    return "success";
  }

  @Mutation(() => PhotographReturnType)
  async uploadImages(
    @Ctx() { req }: DbContext,
    @Arg("inputs") { ipfsLinks, tokenURIs }: uploadInputs
  ): Promise<PhotographReturnType> {
    try {
      if (!req.session.userId) {
        return {
          message: "User ID could not be found.",
        };
      }
      const User = await this.UserRepository.findByUserID(req.session.userId);
      if (!User) {
        return {
          message: "User could not be found.",
        };
      }
      const { data }: ipInfoData = await axios.get(
        `http://ipinfo.io/json?token=${IPINFO_KEY}`
      );
      if (!data) {
        return {
          message: "Location finder  service is unavailable at the moment.",
        };
      }
      const location = await this.LocationRepository.findLocation(
        data.city,
        data.region
      );

      if (!location) {
        return {
          message: "Location could not be found.",
        };
      }
      let counter = 0;
      const images: Photograph[] = [];
      for (const link of ipfsLinks) {
        const photograph = new Photograph();
        photograph.imageLink = link;
        photograph.tokenURI = tokenURIs[counter];
        photograph.user = User;
        photograph.location = location;
        counter++;
        images.push(photograph);
        await photograph.save();
      }
      return {
        images: images,
      };
    } catch (error) {
      console.error(error);
      return {
        message: "An error has occured.",
      };
    }
  }
}
