import { User } from "./User";
import { Location } from "./Location";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Photograph extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "bytea" })
  value!: Buffer;

  @ManyToOne(() => User, (user) => user.userID)
  user!: User;

  @ManyToOne(() => Location, (location) => location.id)
  location!: Location;
}
