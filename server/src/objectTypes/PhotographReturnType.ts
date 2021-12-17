import { Field, ObjectType } from "type-graphql";
import { Photograph } from "../entities/Photograph";
import { PhotographError } from "./PhotographError";

@ObjectType()
export class PhotographReturnType {
  @Field(() => Photograph, { nullable: true })
  photograph?: Photograph;
  @Field(() => PhotographError, { nullable: true })
  error?: PhotographError;
  @Field(() => String, { nullable: true })
  message?: string;
  @Field(() => [Photograph], { nullable: true })
  images?: Photograph[];
}
