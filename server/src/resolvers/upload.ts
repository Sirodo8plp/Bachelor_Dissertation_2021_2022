import axios from "axios";
import * as cloudinary from "cloudinary";
import crypto from "crypto";
import { FileUpload, GraphQLUpload } from "graphql-upload";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { IPINFO_KEY } from "../constants";
import { Location } from "../entities/Location";
import { Photograph } from "../entities/Photograph";
import { User } from "../entities/User";
import { DbContext } from "../types";

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

interface cloudinaryResponse {
  width?: string;
  height?: string;
  created_at?: string;
  url?: string;
  secure_url?: string;
}

@Resolver()
export class UploadResolver {
  @Mutation(() => String)
  async uploadImage(
    @Arg("image", () => GraphQLUpload)
    { createReadStream }: FileUpload,
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

      const upload_stream = cloudinary.v2.uploader.upload_stream(
        {
          tags: `${user.username}_photographs`,
          folder: `${user.username}_folder`,
          overwrite: true,
        },
        async function (err, image) {
          if (err) console.error(err);
          if (image) {
            const photograph = await getConnection()
              .getRepository(Photograph)
              .create({
                imageLink: image.url,
                user: user,
                location: location,
              })
              .save();
          }
        }
      );
      const file_reader = createReadStream().pipe(upload_stream);

      return "Image was successfully uploaded.";

      // return new Promise(async (resolve, reject) => {
      //   createReadStream()
      //     .pipe(
      //       createWriteStream(
      //         `${__dirname}/../../images/${
      //           user.username + "_" + timestamp + "_" + filename
      //         }`
      //       )
      //     )
      //     .on("finish", () => resolve("Image was successfully uploaded!"))
      //     .on("error", () => reject("An error has occured."));
      // });
    } catch (error) {
      console.error("upload entity: ", error);
      return "An internal server error has occured. That's all we know.";
    }
  }
}
