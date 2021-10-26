import { User } from "./User";
import { Location } from "./Location";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Photograph extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ type: "bytea" })
  value!: Buffer;

  @Field(() => Number)
  @Column()
  photographerID!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.photographs)
  user: User;

  @Field(() => Number)
  @Column()
  locationID: number;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.photographs)
  location: Location;
}
