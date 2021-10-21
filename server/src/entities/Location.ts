import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Photograph } from "./Photograph";
import { User } from "./User";

@Entity()
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @PrimaryColumn()
  @Column()
  regionName: string;

  @PrimaryColumn()
  @Column()
  city: string;

  @PrimaryColumn()
  @Column()
  zipCode: number;

  @ManyToMany(() => User, (user) => user.userID)
  users?: User[];

  @ManyToOne(() => Photograph, (photograph) => photograph.id)
  photographs?: Photograph[];
}
