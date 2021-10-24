import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Photograph } from "./Photograph";
import { User } from "./User";

@ObjectType()
@Entity()
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
  @ManyToMany(() => User, (user) => user.userID)
  users?: User[];

  @Field(() => [Photograph])
  @ManyToOne(() => Photograph, (photograph) => photograph.location)
  photos?: Photograph[];
}
