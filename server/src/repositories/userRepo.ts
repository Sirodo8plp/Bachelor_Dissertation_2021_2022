import { DeleteResult, EntityRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import * as argon2 from "argon2";
import { Postcard } from "../entities/Postcard";
import { rejects } from "assert";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  findByUserID(id: number): Promise<User | undefined> {
    return this.createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOne();
  }

  findByUsername(username: string): Promise<User | undefined> {
    return this.createQueryBuilder("user")
      .where("user.username = :username", { username })
      .getOne();
  }

  findAll() {
    return this.createQueryBuilder("user")
      .leftJoinAndSelect("user.locations", "location")
      .leftJoinAndSelect("user.photographs", "photograph")
      .leftJoinAndSelect("user.postcards", "postcard")
      .getMany();
  }

  findOrFailByID(id: number | undefined): Promise<User> {
    return this.createQueryBuilder("user")
      .where("user.id = :id", { id })
      .getOneOrFail();
  }

  async register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const hashedPassword = await argon2.hash(password);
    return this.createQueryBuilder("user")
      .insert()
      .into(User)
      .values({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        email,
      })
      .returning("*")
      .execute();
  }

  removeUserByID(id: number): Promise<DeleteResult> {
    return this.createQueryBuilder("user")
      .delete()
      .from(User)
      .where("id = :id", { id })
      .execute();
  }

  getUserWithAllPostcards(
    id: number | undefined
  ): Promise<User | undefined | string> {
    try {
      return this.createQueryBuilder("user")
        .leftJoinAndSelect("user.postcards", "postcard")
        .leftJoinAndSelect("postcard.photographs", "photograph")
        .where("user.id = :id", { id })
        .orderBy("postcard.id", "DESC")
        .getOne();
    } catch (error) {
      return new Promise((_, reject) => {
        reject("No cookie was found.");
      });
    }
  }
}
