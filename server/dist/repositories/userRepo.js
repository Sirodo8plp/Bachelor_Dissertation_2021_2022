"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../entities/User");
const argon2 = __importStar(require("argon2"));
let UserRepository = class UserRepository extends typeorm_1.Repository {
    findByUserID(id) {
        return this.createQueryBuilder("user")
            .where("user.id = :id", { id })
            .getOne();
    }
    findByUsername(username) {
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
    findOrFailByID(id) {
        return this.createQueryBuilder("user")
            .where("user.id = :id", { id })
            .getOneOrFail();
    }
    register(username, password, firstName, lastName, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield argon2.hash(password);
            return this.createQueryBuilder("user")
                .insert()
                .into(User_1.User)
                .values({
                username,
                password: hashedPassword,
                firstName,
                lastName,
                email,
            })
                .returning("*")
                .execute();
        });
    }
    removeUserByID(id) {
        return this.createQueryBuilder("user")
            .delete()
            .from(User_1.User)
            .where("id = :id", { id })
            .execute();
    }
    getUserWithAllPostcards(id) {
        try {
            return this.createQueryBuilder("user")
                .leftJoinAndSelect("user.postcards", "postcard")
                .leftJoinAndSelect("postcard.photographs", "photograph")
                .where("user.id = :id", { id })
                .orderBy("postcard.id", "DESC")
                .getOne();
        }
        catch (error) {
            return new Promise((_, reject) => {
                reject("No cookie was found.");
            });
        }
    }
};
UserRepository = __decorate([
    (0, typeorm_1.EntityRepository)(User_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepo.js.map