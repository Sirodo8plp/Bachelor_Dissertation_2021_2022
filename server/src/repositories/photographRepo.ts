import { User } from "../entities/User";
import { DeleteResult, EntityRepository, Repository } from "typeorm";
import { Photograph } from "../entities/Photograph";
import { Location } from "../entities/Location";

@EntityRepository(Photograph)
export class PhotographRepository extends Repository<Photograph> {
  findAllPhotographs(): Promise<Photograph[]> {
    return this.createQueryBuilder("photograph")
      .leftJoinAndSelect("photograph.user", "user")
      .leftJoinAndSelect("photograph.location", "location")
      .getMany();
  }

  removePhotographByID(id: number): Promise<DeleteResult> {
    return this.createQueryBuilder("photograph")
      .delete()
      .from(Photograph)
      .where("id = :id", { id })
      .execute();
  }

  insertPhotograph(imageLink: string, user: User, location: Location) {
    return this.createQueryBuilder("photograph")
      .insert()
      .into(Photograph)
      .values({
        imageLink,
        user,
        location,
      })
      .returning("*")
      .execute();
  }
}
