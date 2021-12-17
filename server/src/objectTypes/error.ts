import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class DbError {
    @Field()
    field: string
    @Field()
    message: string
}