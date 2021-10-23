import { Location } from "src/entities/Location";
import { Field, ObjectType } from "type-graphql";
import { LocationError } from "./LocationError";

@ObjectType()
export class LocationReturnType {
  @Field(() => Location, { nullable: true })
  location?: Location;
  @Field(() => LocationError, { nullable: true })
  error?: LocationError;
}