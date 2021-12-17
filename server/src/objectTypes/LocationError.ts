import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class LocationError {
  @Field(() => String)
  type: string;
  @Field(() => String)
  message: string;
}
