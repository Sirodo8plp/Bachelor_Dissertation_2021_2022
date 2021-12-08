"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhotographRepository = void 0;
const typeorm_1 = require("typeorm");
const Photograph_1 = require("../entities/Photograph");
let PhotographRepository = class PhotographRepository extends typeorm_1.Repository {
    findAllPhotographs() {
        return this.createQueryBuilder("photograph")
            .leftJoinAndSelect("photograph.user", "user")
            .leftJoinAndSelect("photograph.location", "location")
            .leftJoinAndSelect("photograph.postcard", "postcard")
            .getMany();
    }
    findAllUserPhotographs(id, take, skip) {
        return this.createQueryBuilder("photograph")
            .leftJoinAndSelect("photograph.user", "user")
            .leftJoinAndSelect("photograph.location", "location")
            .where("user.id = :id", { id })
            .skip(skip)
            .take(take)
            .getMany();
    }
    removePhotographByID(id) {
        return this.createQueryBuilder("photograph")
            .delete()
            .from(Photograph_1.Photograph)
            .where("id = :id", { id })
            .execute();
    }
    insertPhotograph(imageLink, user, location) {
        return this.createQueryBuilder("photograph")
            .insert()
            .into(Photograph_1.Photograph)
            .values({
            imageLink,
            user,
            location,
        })
            .returning("*")
            .execute();
    }
    updatePhotograph(postcard, imageLink) {
        return this.createQueryBuilder("photograph")
            .update(Photograph_1.Photograph)
            .set({ postcard: postcard })
            .where("imageLink = :imageLink", { imageLink })
            .execute();
    }
    removeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let photographs = yield this.createQueryBuilder("photograph").getMany();
            photographs.forEach((photograph) => {
                let id = photograph.id;
                return this.createQueryBuilder("photograph")
                    .delete()
                    .from(Photograph_1.Photograph)
                    .where("id = :id", { id })
                    .execute();
            });
        });
    }
};
PhotographRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Photograph_1.Photograph)
], PhotographRepository);
exports.PhotographRepository = PhotographRepository;
//# sourceMappingURL=photographRepo.js.map