import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
} from "typeorm";
import { Location } from "../entities/Location";
import { User } from "../entities/User";

@EntityRepository(Location)
export class LocationRepository extends Repository<Location> {
  findLocation(city: string, region: string): Promise<Location | undefined> {
    return this.createQueryBuilder("location")
      .where("location.city = :city", { city })
      .andWhere("location.region = :region", { region })
      .leftJoinAndSelect("location.users", "user")
      .getOne();
  }

  findLocationByID(id: number): Promise<Location | undefined> {
    return this.createQueryBuilder("location")
      .where("location.id = :id", { id })
      .leftJoinAndSelect("location.users", "user")
      .leftJoinAndSelect("location.photographs", "photograph")
      .getOne();
  }

  findAllLocations(): Promise<Location[]> {
    return this.createQueryBuilder("location")
      .leftJoinAndSelect("location.users", "user")
      .leftJoinAndSelect("location.photographs", "photograph")
      .leftJoinAndSelect("photograph.user", "user1")
      .getMany();
  }

  removeLocationByID(id: number): Promise<DeleteResult> {
    return this.createQueryBuilder("location")
      .delete()
      .from(Location)
      .where("id = :id", { id })
      .execute();
  }

  insertLocation(
    city: string,
    region: string,
    user: User
  ): Promise<InsertResult> {
    return this.createQueryBuilder("location")
      .insert()
      .into(Location)
      .values({
        city,
        region,
        users: [user],
      })
      .returning("*")
      .execute();
  }
}
