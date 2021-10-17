import {
    Entity,
    PrimaryKey,
    Property,
    Unique
} from "@mikro-orm/core";


@Entity()
export class Location {

    @PrimaryKey()
    id!: number

    @Unique()
    @Property()
    name!: string
}