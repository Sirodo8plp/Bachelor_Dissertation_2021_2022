"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.PostcardResolver = void 0;
const crypto_1 = __importDefault(require("crypto"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Postcard_1 = require("../entities/Postcard");
const postcardInputs_1 = require("../inputTypes/postcardInputs");
const locationRepo_1 = require("../repositories/locationRepo");
const photographRepo_1 = require("../repositories/photographRepo");
const postcardRepo_1 = require("../repositories/postcardRepo");
const userRepo_1 = require("../repositories/userRepo");
const getUserAndLocation_1 = __importDefault(require("../utils/getUserAndLocation"));
let PostcardResolver = class PostcardResolver {
    constructor() {
        this.postcardRepository = (0, typeorm_1.getConnection)().getCustomRepository(postcardRepo_1.PostcardRepository);
        this.userRepository = (0, typeorm_1.getConnection)().getCustomRepository(userRepo_1.UserRepository);
        this.locationRepository = (0, typeorm_1.getConnection)().getCustomRepository(locationRepo_1.LocationRepository);
        this.photographRepository = (0, typeorm_1.getConnection)().getCustomRepository(photographRepo_1.PhotographRepository);
    }
    findPostcardById(specialID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.postcardRepository.findPostcardById(specialID);
        });
    }
    createNewPostcard({ req }, { imageLinks, description }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user, location, message } = yield (0, getUserAndLocation_1.default)(req.session.userId);
                if (message) {
                    return null;
                }
                const newPostcard = new Postcard_1.Postcard();
                newPostcard.user = user;
                newPostcard.location = location;
                newPostcard.description = description;
                newPostcard.specialID = crypto_1.default.randomBytes(20).toString("hex");
                newPostcard.photographs = [];
                for (const link of imageLinks) {
                    const photo = yield this.photographRepository.getPhotographByLink(link);
                    newPostcard.photographs.push(photo);
                }
                yield newPostcard.save();
                return newPostcard;
            }
            catch (error) {
                return null;
            }
        });
    }
    getPostcards({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postcardRepository.getPostcards(req.session.userId || 1);
        });
    }
    removePostcardByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.postcardRepository.removePostcardByID(id);
                return "success";
            }
            catch (error) {
                return "An error has occurred.";
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Postcard_1.Postcard, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostcardResolver.prototype, "findPostcardById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Postcard_1.Postcard, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("inputs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, postcardInputs_1.postcardInputs]),
    __metadata("design:returntype", Promise)
], PostcardResolver.prototype, "createNewPostcard", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Postcard_1.Postcard], { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PostcardResolver.prototype, "getPostcards", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("pcID")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostcardResolver.prototype, "removePostcardByID", null);
PostcardResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostcardResolver);
exports.PostcardResolver = PostcardResolver;
//# sourceMappingURL=postcard.js.map