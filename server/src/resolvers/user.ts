import * as argon2 from "argon2";
import { UserRepository } from "../repositories/userRepo";
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
import { USER_COOKIE_NAME } from "../constants";
import { User } from "../entities/User";
import { DbContext } from "../types";
import { DbError } from "./error";

@InputType()
class UserDataInput {
  @Field()
  username: string;
  @Field()
  password: string;
  @Field()
  email: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
}

@ObjectType()
class UserReturnType {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => [DbError], { nullable: true })
  errors?: DbError[];
  @Field(() => String)
  message?: String;
}

@Resolver()
export class UserResolver {
  userRepository = getConnection().getCustomRepository(UserRepository);
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: DbContext) {
    if (!req.session.userId) {
      return null;
    }
    return await this.userRepository.findByUserID(req.session.userId);
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  @Query(() => User, { nullable: true })
  user(@Arg("id") id: number): Promise<User | undefined> {
    return this.userRepository.findByUserID(id);
  }

  @Mutation(() => UserReturnType)
  async register(
    @Arg("inputs")
    { username, password, firstName, lastName, email }: UserDataInput,
    @Ctx() { req }: DbContext
  ): Promise<UserReturnType> {
    try {
      if (!username || !password || !firstName || !lastName || !email) {
        return {
          errors: [
            {
              field: "empty",
              message: "All fields are required in order to proceed.",
            },
          ],
        };
      }
      const _user = await this.userRepository.register(
        username,
        password,
        firstName,
        lastName,
        email
      );
      req.session.userId = _user.raw[0].userID;
      const user = _user.raw[0];
      return { user };
    } catch (error) {
      if (error.detail === `Key (email)=(${email}) already exists.`)
        return {
          errors: [
            {
              field: "email",
              message: "This email is used by another user.",
            },
          ],
        };
      if (error.detail === `Key (username)=(${username}) already exists.`)
        return {
          errors: [
            {
              field: "username",
              message: "This username is taken.",
            },
          ],
        };
      return {
        errors: [
          {
            field: "database",
            message:
              "An internal server error occured. Please, try again later!",
          },
        ],
      };
    }
  }

  @Mutation(() => UserReturnType)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: DbContext
  ): Promise<UserReturnType> {
    try {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        return {
          errors: [
            {
              field: "invalidCredentials",
              message: "This username does not exist.",
            },
          ],
        };
      }
      const passwordIsValid = await argon2.verify(user.password, password);
      if (!passwordIsValid) {
        return {
          errors: [
            {
              field: "invalidCredentials",
              message: "Your credentials are invalid.",
            },
          ],
        };
      }

      req.session.userId = user.id;

      return {
        user,
      };
    } catch (error) {
      console.log("ENTITY:user.ts", error);
      return {
        errors: [
          {
            field: " database",
            message:
              "An internal server error occured. Please, try again later!",
          },
        ],
      };
    }
  }

  @Mutation(() => UserReturnType)
  async deleteUser(@Arg("userID") id: number): Promise<UserReturnType> {
    try {
      const idNumber = await this.userRepository.removeUserByID(id);
      const message = `User with ${id} has been deleted.`;
      return { message };
    } catch (error) {
      return {
        errors: [
          {
            field: "deletion",
            message:
              "An internal server error occured. Please, try again later!",
          },
        ],
      };
    }
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: DbContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(USER_COOKIE_NAME);
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
