import {Entity,PrimaryKey,PrimaryKeyType,Property,Unique
} from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User {

    @Field()
    @PrimaryKey()
    userID!: number

    @Unique()
    @Field(() => String)
    @Property()
    username!: string

    [PrimaryKeyType]: [number, string]

    @Field(() => String)
    @Property()
    password!: string

    @Field(() => String)
    @Property()
    @Unique()
    email!: string

    @Field(() => String)
    @Property()
    firstName!: string

    @Field(() => String)
    @Property()
    lastName!: string
}