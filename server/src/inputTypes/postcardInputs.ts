import { Field, InputType } from "type-graphql";

@InputType()
export class postcardInputs {
  @Field(() => [String])
  imageLinks: string[];
  @Field(() => String)
  description: string;
}
