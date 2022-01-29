import { Field, InputType, Int } from "type-graphql";

@InputType()
export class uploadInputs {
  @Field(() => [String])
  ipfsLinks: string[];
  @Field(() => [String])
  transactionHashes: string[];
}
