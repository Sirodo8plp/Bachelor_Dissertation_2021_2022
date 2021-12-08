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

@ObjectType()
class PostcardReturnType {
  @Field(() => Postcard)
  postcard?: Postcard;
  @Field(() => String)
  error?: string;
  @Field(() => String)
  message?: string;
}

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
  async findPostcardById(id: number): Promise<Postcard | undefined> {
    return await this.postcardRepository.findPostcardById(id);
  }

  @Mutation(() => PostcardReturnType)
  async createNewPostcard(
    @Ctx() { req }: DbContext,
    @Arg("inputs") { imageLinks, description }: postcardInputs
  ): Promise<PostcardReturnType> {
    try {
      const { user, location, message } = await getUserAndLocation(
        req.session.userId
      );
      if (message) {
        return {
          message: "An error has occured",
        };
      }
      const newPostcard = new Postcard();
      newPostcard.user = user!;
      newPostcard.location = location!;
      newPostcard.description = description;
      await newPostcard.save();

      for (const link of imageLinks) {
        await this.photographRepository.updatePhotograph(newPostcard, link);
      }

      return {
        message: "Postcard was successfully created.",
      };
    } catch (error) {
      return {
        error: "An error has occured.",
      };
    }
  }

  @Query(() => User, { nullable: true })
  async getPostcards(
    @Ctx() { req }: DbContext
  ): Promise<User | undefined | string> {
    return this.userRepository.getUserWithAllPostcards(req.session.userId || 1);
  }
}
