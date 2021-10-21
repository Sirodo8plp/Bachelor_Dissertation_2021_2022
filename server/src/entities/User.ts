import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Location } from "./Location";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  userID!: number;

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

  @ManyToMany(() => Location, (location) => location.id)
  @JoinTable()
  locations: Location[];
}
