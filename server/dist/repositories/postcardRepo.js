"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostcardRepository = void 0;
const typeorm_1 = require("typeorm");
const Postcard_1 = require("../entities/Postcard");
let PostcardRepository = class PostcardRepository extends typeorm_1.Repository {
    createPostcard(User, Location, description) {
        return this.createQueryBuilder("postcard")
            .insert()
            .into(Postcard_1.Postcard)
            .values({
            user: User,
            location: Location,
            description: description,
        })
            .returning("*")
            .execute();
    }
    removePostcardById(id) {
        return this.createQueryBuilder("postcard")
            .delete()
            .from(Postcard_1.Postcard)
            .where("id = :id", { id })
            .execute();
    }
    findPostcardById(id) {
        return this.createQueryBuilder("postcard")
            .where("postcard.id = :id", { id })
            .leftJoinAndSelect("postcard.user", "user")
            .leftJoinAndSelect("postcard.location", "location")
            .leftJoinAndSelect("postcard.photographs", "photograph")
            .getOne();
    }
};
PostcardRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Postcard_1.Postcard)
], PostcardRepository);
exports.PostcardRepository = PostcardRepository;
//# sourceMappingURL=postcardRepo.js.map