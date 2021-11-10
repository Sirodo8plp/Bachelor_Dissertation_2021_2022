import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Photograph } from "../entities/Photograph";
import { PhotographRepository } from "../repositories/photographRepo";
import * as cloudinary from "cloudinary";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { DbContext } from "../types";
import crypto from "crypto";
import { UserRepository } from "../repositories/userRepo";
import { LocationRepository } from "../repositories/locationRepo";
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

@ObjectType()
class PhotographReturnType {
  @Field(() => Photograph, { nullable: true })
  photograph?: Photograph;
  @Field(() => PhotographError, { nullable: true })
  error?: PhotographError;
  @Field(() => String)
  message?: string;
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

  @Mutation(() => String)
  async removePhotograph(@Arg("id") id: number): Promise<string> {
    await getConnection().getRepository(Photograph).delete({ id: id });
    return "success";
  }

  @Mutation(() => String)
  async uploadImage(
    @Arg("image", () => GraphQLUpload)
    { createReadStream }: FileUpload,
    @Ctx() { req }: DbContext
  ): Promise<String> {
    try {
      const timestamp = crypto.randomBytes(20).toString("hex");
      const user = await this.UserRepository.findOrFailByID(req.session.userId);
      const { data }: ipInfoData = await axios.get(
        `http://ipinfo.io/json?token=${IPINFO_KEY}`
      );
      if (!data) {
        return "An unexpected error has occured. Please, try again later!";
      }
      const location = await this.LocationRepository.findLocation(
        data.city,
        data.region
      );
      if (!location) {
        return "Location could not be found. Please, try again later.";
      }

      const upload_stream = cloudinary.v2.uploader.upload_stream(
        {
          tags: `${user.username}_photographs`,
          folder: `${user.username}_folder`,
          overwrite: true,
        },
        async function (err, image) {
          if (err) {
            console.error(err);
          }
          if (image) {
            console.log(image);
            try {
              const photographExists = await Photograph.findOne({
                etag: image.etag,
              });
              if (!photographExists) {
                const photograph = new Photograph();
                photograph.etag = image.etag;
                photograph.imageLink = image.url;
                photograph.user = user;
                photograph.location = location;
                await photograph.save();
              }
            } catch (error) {
              console.error(error);
            }
          }
        }
      );
      const file_reader = createReadStream().pipe(upload_stream);
      return "Image was successfully uploaded.";
    } catch (error) {
      console.error("photograph entity: ", error);
      return "An internal server error has occured. That's all we know.";
    }
  }

  @Mutation(() => String)
  async deleteAllPhotographs() {
    await this.PhotographRepository.removeAll();
    return "success";
  }
}
