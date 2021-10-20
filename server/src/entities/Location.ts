import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Photograph } from "./Photograph";
import { User } from "./User";

@Entity()
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  city!: string;

  @Column()
  country!: string;

  @ManyToMany(() => User, (user) => user.userID)
  users?: User[];

  @ManyToOne(() => Photograph, (photograph) => photograph.id)
  photographs?: Photograph[];
}
