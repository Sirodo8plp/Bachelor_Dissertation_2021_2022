import { DbContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Photograph } from "../entities/Photograph";
import { LocationRepository } from "../repositories/locationRepo";
import { PhotographRepository } from "../repositories/photographRepo";
import { UserRepository } from "../repositories/userRepo";
import { ipInfoData } from "../interfaces/ipInfoData";
import axios from "axios";
import { IPINFO_KEY } from "../constants";

@ObjectType()
class PhotographError {
  @Field(() => String)
  type: string;
  @Field(() => String)
  message: string;
}

@InputType()
class uploadInputs {
  @Field(() => [String])
  ipfsLinks: string[];
  @Field(() => [Int])
  tokenURIs: number[];
}

@InputType()
class searchInputs {
  @Field(() => Int!)
  take: number;
  @Field(() => Int!)
  skip: number;
}

@ObjectType()
class PhotographReturnType {
  @Field(() => Photograph, { nullable: true })
  photograph?: Photograph;
  @Field(() => PhotographError, { nullable: true })
  error?: PhotographError;
  @Field(() => String)
  message?: string;
}

@ObjectType()
class PhotographInformation {
  @Field(() => [Photograph], { nullable: true })
  photographs: Photograph[];
  @Field(() => Number, { nullable: true })
  counter: number;
}

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

  @Query(() => [Photograph], { nullable: true })
  async getUserPhotographs(
    @Arg("searchInputs") { take, skip }: searchInputs,
    @Ctx()
    { req }: DbContext
  ): Promise<Photograph[] | null> {
    if (!req) {
      return null;
    }
    return await this.PhotographRepository.findAllUserPhotographs(
      req.session.userId!,
      take,
      skip
    );
  }

  @Query(() => PhotographInformation, { nullable: true })
  async getUserPhotographsInformation(@Ctx() { req }: DbContext) {
    if (!req) {
      return null;
    }
    return await this.PhotographRepository.getFirstUserPhotographsAndCount(
      req.session.userId || 1
    );
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

      for (let i = 0; i < ipfsLinks.length; i++) {
        const photograph = new Photograph();
        photograph.imageLink = ipfsLinks[i];
        photograph.tokenURI = tokenURIs[i];
        photograph.user = User;
        photograph.location = location;
        await photograph.save();
      }
      return {
        message: "All images were successfully uploaded!",
      };
    } catch (error) {
      console.error(error);
      return {
        message: "An error has occured.",
      };
    }
  }
}
