import {
    Entity,
    PrimaryKey,
    Property,
} from "@mikro-orm/core";


@Entity()
export class VisitedLocation {

    @PrimaryKey()
    id!: number

    @Property()
    userID!: number

    @Property()
    locationID!: number
}   