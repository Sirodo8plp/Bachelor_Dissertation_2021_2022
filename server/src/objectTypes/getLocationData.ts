import { Field, ObjectType } from "type-graphql";
import { Location } from "../entities/Location";

@ObjectType()
export class getLocationData {
  @Field(() => [Location], { nullable: true })
  locations?: Location[];
  @Field(() => String, { nullable: true })
  error?: string;
}
