"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
};
PhotographRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Photograph_1.Photograph)
], PhotographRepository);
exports.PhotographRepository = PhotographRepository;
//# sourceMappingURL=photographRepo.js.map