import { User } from "./User";
import { Location } from "./Location";
import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photograph extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.userID)
  user!: User;

  @ManyToOne(() => Location, (location) => location.city)
  location!: Location;
}
