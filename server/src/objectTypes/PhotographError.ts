import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PhotographError {
  @Field(() => String)
  type: string;
  @Field(() => String)
  message: string;
}
