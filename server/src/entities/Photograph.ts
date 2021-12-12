import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Location } from "./Location";
import { Postcard } from "./Postcard";
import { User } from "./User";

@ObjectType()
@Entity()
export class Photograph extends BaseEntity {
  @Field(() => Number)
  @Column()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  imageLink!: string;

  @Field(() => Number)
  @Column()
  tokenURI!: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.photographs)
  user: User;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.photographs)
  location: Location;

  @Field(() => [Postcard])
  @ManyToMany(() => Postcard, (postcard) => postcard.photographs)
  postcards: Postcard[];
}
