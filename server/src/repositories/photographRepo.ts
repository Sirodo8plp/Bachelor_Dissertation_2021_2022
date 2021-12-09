import { User } from "../entities/User";
import {
  DeleteResult,
  EntityRepository,
  Repository,
  UpdateResult,
} from "typeorm";
import { Photograph } from "../entities/Photograph";
import { Location } from "../entities/Location";
import { Postcard } from "../entities/Postcard";

@EntityRepository(Photograph)
export class PhotographRepository extends Repository<Photograph> {
  findAllPhotographs(): Promise<Photograph[]> {
    return this.createQueryBuilder("photograph")
      .leftJoinAndSelect("photograph.user", "user")
      .leftJoinAndSelect("photograph.location", "location")
      .leftJoinAndSelect("photograph.postcard", "postcard")
      .getMany();
  }

  findAllUserPhotographs(
    id: number,
    take: number,
    skip: number
  ): Promise<Photograph[]> {
    return this.createQueryBuilder("photograph")
      .leftJoinAndSelect("photograph.user", "user")
      .leftJoinAndSelect("photograph.location", "location")
      .where("user.id = :id", { id })
      .skip(skip)
      .take(take)
      .getMany();
  }

  async getFirstUserPhotographsAndCount(id: number) {
    const photographs = await this.createQueryBuilder("photograph")
      .leftJoinAndSelect("photograph.user", "user")
      .leftJoinAndSelect("photograph.location", "location")
      .where("user.id = :id", { id })
      .take(6)
      .getMany();
    const counter = await this.createQueryBuilder("photograph")
      .leftJoinAndSelect("photograph.user", "user")
      .leftJoinAndSelect("photograph.location", "location")
      .where("user.id = :id", { id })
      .getCount();

    return {
      photographs,
      counter,
    };
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

  updatePhotograph(
    postcard: Postcard,
    imageLink: String
  ): Promise<UpdateResult> {
    return this.createQueryBuilder("photograph")
      .update(Photograph)
      .set({ postcard: postcard })
      .where("imageLink = :imageLink", { imageLink })
      .execute();
  }

  async removeAll() {
    let photographs = await this.createQueryBuilder("photograph").getMany();
    photographs.forEach((photograph) => {
      let id = photograph.id;
      return this.createQueryBuilder("photograph")
        .delete()
        .from(Photograph)
        .where("id = :id", { id })
        .execute();
    });
  }
}
