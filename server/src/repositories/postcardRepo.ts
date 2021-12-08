import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
} from "typeorm";
import { Postcard } from "../entities/Postcard";
import { User } from "../entities/User";
import { Location } from "../entities/Location";

@EntityRepository(Postcard)
export class PostcardRepository extends Repository<Postcard> {
  createPostcard(
    User: User,
    Location: Location,
    description: string
  ): Promise<InsertResult> {
    return this.createQueryBuilder("postcard")
      .insert()
      .into(Postcard)
      .values({
        user: User,
        location: Location,
        description: description,
      })
      .returning("*")
      .execute();
  }

  removePostcardById(id: number): Promise<DeleteResult> {
    return this.createQueryBuilder("postcard")
      .delete()
      .from(Postcard)
      .where("id = :id", { id })
      .execute();
  }

  findPostcardById(id: number): Promise<Postcard | undefined> {
    return this.createQueryBuilder("postcard")
      .where("postcard.id = :id", { id })
      .leftJoinAndSelect("postcard.user", "user")
      .leftJoinAndSelect("postcard.location", "location")
      .leftJoinAndSelect("postcard.photographs", "photograph")
      .getOne();
  }
}
