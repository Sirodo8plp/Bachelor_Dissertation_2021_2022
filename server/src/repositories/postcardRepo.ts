import {
  DeleteResult,
  EntityRepository,
  InsertResult,
  Repository,
} from "typeorm";
import { Postcard } from "../entities/Postcard";
import { User } from "../entities/User";
import { Location } from "../entities/Location";
import { Photograph } from "../entities/Photograph";
import crypto from "crypto";

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
        specialID: crypto.randomBytes(20).toString(),
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

  findPostcardById(id: string): Promise<Postcard | undefined> {
    return this.createQueryBuilder("postcard")
      .where("postcard.specialID = :specialID", { specialID: id })
      .leftJoinAndSelect("postcard.user", "user")
      .leftJoinAndSelect("postcard.location", "location")
      .leftJoinAndSelect("postcard.photographs", "photograph")
      .getOne();
  }

  async removePostcardByID(postcardId: number) {
    const p = await this.createQueryBuilder("postcard")
      .where("postcard.id = :id", { id: postcardId })
      .leftJoinAndSelect("postcard.photographs", "photograph")
      .leftJoinAndSelect("photograph.postcards", "postcard1")
      .getOne();

    if (!p || !p!.photographs) return;
    for (const photo of p!.photographs) {
      photo.postcards.filter((pc) => pc.id != postcardId);
      await photo.save();
    }
    return this.createQueryBuilder("postcard")
      .delete()
      .from(Postcard)
      .where("postcard.id = :id", { id: postcardId })
      .execute();
  }

  getPostcards(userID: number): Promise<Postcard[]> {
    try {
      return this.createQueryBuilder("postcard")
        .where("postcard.user.id = :id", {
          id: userID,
        })
        .leftJoinAndSelect("postcard.photographs", "photograph")
        .orderBy("postcard.id", "DESC")
        .getMany();
    } catch (error) {
      return new Promise((_, reject) => {
        reject(null);
      });
    }
  }
}
