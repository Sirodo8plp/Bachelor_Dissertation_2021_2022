import {
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    PrimaryKey,
} from "@mikro-orm/core";
import { User } from "./User";
import { Location } from "./Locations";


@Entity()
export class Photograph {

    @PrimaryKey()
    id!: number

    @ManyToOne(() => User)
    user!: User 

    @ManyToMany(() => Location)
    locations = new Collection<Location>(this)
}