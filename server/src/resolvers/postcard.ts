import getUserAndLocation from "../utils/getUserAndLocation";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Postcard } from "../entities/Postcard";
import { User } from "../entities/User";
import { LocationRepository } from "../repositories/locationRepo";
import { PhotographRepository } from "../repositories/photographRepo";
import { PostcardRepository } from "../repositories/postcardRepo";
import { UserRepository } from "../repositories/userRepo";
import { DbContext } from "../types";
import crypto from "crypto";

@InputType()
class postcardInputs {
  @Field(() => [String])
  imageLinks: string[];
  @Field(() => String)
  description: string;
}

@Resolver()
export class PostcardResolver {
  postcardRepository = getConnection().getCustomRepository(PostcardRepository);
  userRepository = getConnection().getCustomRepository(UserRepository);
  locationRepository = getConnection().getCustomRepository(LocationRepository);
  photographRepository =
    getConnection().getCustomRepository(PhotographRepository);

  @Query(() => Postcard, { nullable: true })
  async findPostcardById(
    @Arg("id") specialID: string
  ): Promise<Postcard | undefined> {
    return await this.postcardRepository.findPostcardById(specialID);
  }

  @Mutation(() => Postcard, { nullable: true })
  async createNewPostcard(
    @Ctx() { req }: DbContext,
    @Arg("inputs") { imageLinks, description }: postcardInputs
  ): Promise<Postcard | null> {
    try {
      const { user, location, message } = await getUserAndLocation(
        req.session.userId
      );
      if (message) {
        return null;
      }
      const newPostcard = new Postcard();
      newPostcard.user = user!;
      newPostcard.location = location!;
      newPostcard.description = description;
      newPostcard.specialID = crypto.randomBytes(20).toString("hex");
      newPostcard.photographs = [];

      for (const link of imageLinks) {
        const photo = await this.photographRepository.getPhotographByLink(link);
        newPostcard.photographs.push(photo!);
      }
      await newPostcard.save();
      return newPostcard;
    } catch (error) {
      return null;
    }
  }

  @Query(() => [Postcard], { nullable: true })
  async getPostcards(@Ctx() { req }: DbContext): Promise<Postcard[]> {
    return this.postcardRepository.getPostcards(req.session.userId || 1);
  }

  @Mutation(() => String)
  async removePostcardByID(@Arg("pcID") id: number) {
    try {
      await this.postcardRepository.removePostcardByID(id);
      return "success";
    } catch (error) {
      return "An error has occurred.";
    }
  }
}
