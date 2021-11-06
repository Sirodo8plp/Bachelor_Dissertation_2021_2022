import fs from "fs";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Photograph } from "../entities/Photograph";

@ObjectType()
class PhotographError {
  @Field(() => String)
  type: string;
  @Field(() => String)
  message: string;
}

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
  @Query(() => [Photograph])
  async getPhotographs(): Promise<Photograph[]> {
    return await Photograph.find({
      where: {},
      relations: ["location", "user"],
    });
  }

  @Mutation(() => String)
  async removePhotograph(@Arg("id") id: number): Promise<string> {
    await getConnection().getRepository(Photograph).delete({ id: id });
    return "success";
  }

  // @Query(() => String)
  // async showPhotographValue(@Arg("id") id: number): Promise<string> {
  //   const photograph = await Photograph.findOne({ id: id });
  //   return fs.readFileSync(
  //     `${__dirname}/../../images/${photograph?}`,
  //     "base64"
  //   );
  // }

  // @Mutation(() => PhotographReturnType)
  // async insertPhotograph(
  //   @Arg("base64value") value: string,
  //   @Ctx() { req }: DbContext
  // ): Promise<PhotographReturnType> {
  //   try {
  //     const currentUser = await User.findOne({ id: req.session.userId });
  //     const { data }: ipInfoData = await axios.get(
  //       `http://ipinfo.io/json?token=${IPINFO_KEY}`
  //     );
  //     if (!data) {
  //       return {
  //         error: {
  //           type: "APIERROR",
  //           message:
  //             "Your location could not be found. Please, try again later.",
  //         },
  //       };
  //     }
  //     const currentLocation = await Location.findOne({
  //       city: data.city,
  //       region: data.region,
  //     });
  //     const photograph = await Photograph.create({
  //       value: Buffer.from(value, "utf-8"),
  //       user: currentUser,
  //       location: currentLocation,
  //     }).save();
  //     return {
  //       photograph,
  //     };
  //   } catch (err) {
  //     console.error(err);
  //     return {
  //       error: {
  //         type: "ExceptionOccured",
  //         message: "An internal server occured. That's all we know.",
  //       },
  //     };
  //   }
  // }
}
