import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { GraphQLUpload, FileUpload } from "graphql-upload";
import { DbContext } from "../types";
import { User } from "../entities/User";
import axios from "axios";
import { IPINFO_KEY } from "../constants";
import { Location } from "../entities/Location";
import { getConnection } from "typeorm";
import { Photograph } from "../entities/Photograph";
import { createWriteStream } from "fs";
import crypto from "crypto";

interface ipInfoData {
  data: {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    timezone: string;
  };
}

@Resolver()
export class UploadResolver {
  @Mutation(() => String)
  async uploadImage(
    @Arg("image", () => GraphQLUpload)
    { filename, createReadStream }: FileUpload,
    @Ctx() { req }: DbContext
  ): Promise<String> {
    try {
      const timestamp = crypto.randomBytes(20).toString("hex");
      const user = await User.findOne({ id: req.session.userId });
      const { data }: ipInfoData = await axios.get(
        `http://ipinfo.io/json?token=${IPINFO_KEY}`
      );
      if (!user || !data) {
        return "An unexpected error has occured. Please, try again later!";
      }
      const location = await Location.findOne({
        city: data.city,
        region: data.region,
      });
      if (!location) {
        return "Location could not be found. Please, try again later.";
      }
      const photograph = await getConnection()
        .getRepository(Photograph)
        .create({
          imageName: `${user.username}_${timestamp}_${filename}`,
          user: user,
          location: location,
        })
        .save();
      return new Promise(async (resolve, reject) => {
        createReadStream()
          .pipe(
            createWriteStream(
              `${__dirname}/../../images/${
                user.username + "_" + timestamp + "_" + filename
              }`
            )
          )
          .on("finish", () => resolve("Image was successfully uploaded!"))
          .on("error", () => reject("An error has occured."));
      });
    } catch (error) {
      console.error("upload entity: ", error);
      return "An internal server error has occured. That's all we know.";
    }
  }
}
