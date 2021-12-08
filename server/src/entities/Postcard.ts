import { User } from "./User";
import { Location } from "./Location";
import { Photograph } from "./Photograph";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Postcard extends BaseEntity {
  @Field(() => Number)
  @Column()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column()
  description?: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.postcards)
  user: User;

  @Field(() => Location)
  @ManyToOne(() => Location, (location) => location.photographs)
  location!: Location;

  @Field(() => [Photograph])
  @OneToMany(() => Photograph, (photograph) => photograph.postcard)
  photographs: Photograph[];
}
