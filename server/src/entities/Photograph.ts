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
  @Column()
  imageLink!: string;

  @Field(() => String)
  @Column()
  etag!: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.photographs)
  user: User;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.photographs)
  location: Location;
}
