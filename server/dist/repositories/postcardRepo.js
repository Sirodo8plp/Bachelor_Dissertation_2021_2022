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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostcardRepository = void 0;
const typeorm_1 = require("typeorm");
const Postcard_1 = require("../entities/Postcard");
const crypto_1 = __importDefault(require("crypto"));
let PostcardRepository = class PostcardRepository extends typeorm_1.Repository {
    createPostcard(User, Location, description) {
        return this.createQueryBuilder("postcard")
            .insert()
            .into(Postcard_1.Postcard)
            .values({
            user: User,
            location: Location,
            description: description,
            specialID: crypto_1.default.randomBytes(20).toString(),
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
            .where("postcard.specialID = :specialID", { specialID: id })
            .leftJoinAndSelect("postcard.user", "user")
            .leftJoinAndSelect("postcard.location", "location")
            .leftJoinAndSelect("postcard.photographs", "photograph")
            .getOne();
    }
    removePostcardByID(postcardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const p = yield this.createQueryBuilder("postcard")
                .where("postcard.id = :id", { id: postcardId })
                .leftJoinAndSelect("postcard.photographs", "photograph")
                .leftJoinAndSelect("photograph.postcards", "postcard1")
                .getOne();
            console.log("#############################################");
            console.log(p);
            if (!p || !p.photographs)
                return;
            for (const photo of p.photographs) {
                photo.postcards.filter((pc) => pc.id != postcardId);
                yield photo.save();
            }
            return this.createQueryBuilder("postcard")
                .delete()
                .from(Postcard_1.Postcard)
                .where("postcard.id = :id", { id: postcardId })
                .execute();
        });
    }
    getPostcards(userID) {
        try {
            return this.createQueryBuilder("postcard")
                .where("postcard.user.id = :id", {
                id: userID,
            })
                .leftJoinAndSelect("postcard.photographs", "photograph")
                .orderBy("postcard.id", "DESC")
                .getMany();
        }
        catch (error) {
            return new Promise((_, reject) => {
                reject(null);
            });
        }
    }
};
PostcardRepository = __decorate([
    (0, typeorm_1.EntityRepository)(Postcard_1.Postcard)
], PostcardRepository);
exports.PostcardRepository = PostcardRepository;
//# sourceMappingURL=postcardRepo.js.map