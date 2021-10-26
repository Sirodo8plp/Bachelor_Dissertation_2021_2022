import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Photograph } from "./Photograph";
import { User } from "./User";

@ObjectType()
@Entity("location")
export class Location extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @PrimaryColumn()
  @Column()
  region: string;

  @Field(() => String)
  @PrimaryColumn()
  @Column()
  city: string;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.locations)
  users: User[];

  @Field(() => [Photograph])
  @OneToMany(() => Photograph, (photograph) => photograph.location)
  photographs: Photograph[];
}
