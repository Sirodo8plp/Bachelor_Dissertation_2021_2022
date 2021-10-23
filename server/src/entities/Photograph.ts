import { User } from "./User";
import { Location } from "./Location";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Int } from "type-graphql";

@Entity()
export class Photograph extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bytea" })
  value!: Buffer;

  @Column()
  photographerID!: number;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;

  @Column()
  locationID: number;

  @ManyToOne(() => Location, (location) => location.photos)
  location: Location;
}
