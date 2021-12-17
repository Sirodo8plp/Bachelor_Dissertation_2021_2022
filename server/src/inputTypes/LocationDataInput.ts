import { Photograph } from "../entities/Photograph";
import { User } from "../entities/User";
import { Field, InputType } from "type-graphql";

@InputType()
export class LocationDataInput {
  @Field()
  city?: string;
  @Field()
  regionName?: string;
  @Field()
  zipCode?: number;
  @Field()
  user?: User;
  @Field()
  photograph?: Photograph;
}
