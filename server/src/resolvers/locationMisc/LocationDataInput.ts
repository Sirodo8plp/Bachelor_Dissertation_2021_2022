import { Photograph } from "src/entities/Photograph";
import { User } from "src/entities/User";
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
