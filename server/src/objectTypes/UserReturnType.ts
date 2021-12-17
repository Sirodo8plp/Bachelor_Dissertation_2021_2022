import { Field, ObjectType } from "type-graphql";
import { User } from "../entities/User";
import { DbError } from "./error";

@ObjectType()
export class UserReturnType {
  @Field(() => User, { nullable: true })
  user?: User;
  @Field(() => [DbError], { nullable: true })
  errors?: DbError[];
  @Field(() => String)
  message?: String;
}
