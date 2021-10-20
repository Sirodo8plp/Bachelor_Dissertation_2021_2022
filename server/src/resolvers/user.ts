import { User } from "../entities/User";
import { DbContext } from "../types";
import {
  Arg,
  Ctx,
  Query,
  Resolver,
  Mutation,
  InputType,
  Field,
  ObjectType,
} from "type-graphql";
import * as argon2 from "argon2";
import { DbError } from "./error";
import { COOKIE_NAME } from "../constants";

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
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: DbContext) {
    if (!req.session.userId) {
      return null;
    }
    const user = await User.findOne({ userID: req.session.userId });
    return user;
  }

  @Query(() => [User])
  users(): Promise<User[]> {
    return User.find({});
  }

  @Query(() => User, { nullable: true })
  user(@Arg("id") id: number): Promise<User | undefined> {
    return User.findOne({ userID: id });
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

      const hashedPassword = await argon2.hash(password);
      const user = {
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
      };

      await User.create(user).save();

      req.session.userId = user.userID;
      return { user };
    } catch (error) {
      console.error(error);
      if (error.constraint === "user_email_unique")
        return {
          errors: [
            {
              field: "email",
              message: "This email is used by another user.",
            },
          ],
        };
      if (error.constraint === "user_username_unique")
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
    @Ctx() { em, req }: DbContext
  ): Promise<UserReturnType> {
    try {
      const user = await em.findOne(User, { username: username });
      if (!user) {
        return {
          errors: [
            {
              field: "username",
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
              field: "password",
              message: "Your credentials are invalid.",
            },
          ],
        };
      }

      req.session.userId = user.userID;

      return {
        user,
      };
    } catch (error) {
      console.log("error");
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
  async deleteUser(
    @Arg("userID") id: number,
    @Ctx() { em }: DbContext
  ): Promise<UserReturnType> {
    try {
      const idNumber = await em.nativeDelete(User, { userID: id });
      const message = `User with ${idNumber} has been deleted.`;
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
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
