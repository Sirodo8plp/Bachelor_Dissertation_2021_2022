import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Location } from "./Location";
import { Photograph } from "./Photograph";
import { Postcard } from "./Postcard";

@ObjectType()
@Entity("user")
export class User extends BaseEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String)
  @Column({ unique: true })
  username!: string;

  @Field(() => String)
  @Column()
  password!: string;

  @Field(() => String)
  @Column({ unique: true })
  email!: string;

  @Field(() => String)
  @Column()
  firstName!: string;

  @Field(() => String)
  @Column()
  lastName!: string;

  @Field(() => [Location])
  @ManyToMany(() => Location, (location) => location.users)
  @JoinTable()
  locations: Location[];

  @Field(() => [Photograph])
  @OneToMany(() => Photograph, (photograph) => photograph.user)
  @JoinTable()
  photographs: Photograph[];

  @Field(() => [Postcard])
  @OneToMany(() => Postcard, (postcard) => postcard.user)
  @JoinTable()
  postcards: Postcard[];
}
