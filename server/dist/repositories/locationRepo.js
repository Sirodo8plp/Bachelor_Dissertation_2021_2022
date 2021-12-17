"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRepository = void 0;
const typeorm_1 = require("typeorm");
const Location_1 = require("../entities/Location");
let LocationRepository = class LocationRepository extends typeorm_1.Repository {
    findLocation(city, region) {
        return this.createQueryBuilder("location")
            .where("location.city = :city", { city })
            .andWhere("location.region = :region", { region })
            .leftJoinAndSelect("location.users", "user")
            .getOne();
    }
    findLocationByID(id) {
        return this.createQueryBuilder("location")
            .where("location.id = :id", { id })
            .leftJoinAndSelect("location.users", "user")
            .leftJoinAndSelect("location.photographs", "photograph")
            .getOne();
    }
    findAllLocations() {
        return this.createQueryBuilder("location")
            .leftJoinAndSelect("location.users", "user")
            .leftJoinAndSelect("location.photographs", "photograph")
            .leftJoinAndSelect("photograph.user", "user1")
            .getMany();
    }
    removeLocationByID(id) {
        return this.createQueryBuilder("location")
            .delete()
            .from(Location_1.Location)
            .where("id = :id", { id })
            .execute();
    }
    insertLocation(city, region, user) {
        return this.createQueryBuilder("location")
            .insert()
            .into(Location_1.Location)
            .values({
            city,
            region,
            users: [user],
        })
            .returning("*")
            .execute();
    }
};
LocationRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Location_1.Location)
], LocationRepository);
exports.LocationRepository = LocationRepository;
//# sourceMappingURL=locationRepo.js.map