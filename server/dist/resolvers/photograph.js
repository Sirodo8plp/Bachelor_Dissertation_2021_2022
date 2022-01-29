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
exports.PhotographResolver = void 0;
const axios_1 = __importDefault(require("axios"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const constants_1 = require("../constants");
const Photograph_1 = require("../entities/Photograph");
const uploadInputs_1 = require("../inputTypes/uploadInputs");
const PhotographReturnType_1 = require("../objectTypes/PhotographReturnType");
const locationRepo_1 = require("../repositories/locationRepo");
const photographRepo_1 = require("../repositories/photographRepo");
const userRepo_1 = require("../repositories/userRepo");
let PhotographResolver = class PhotographResolver {
    constructor() {
        this.PhotographRepository = (0, typeorm_1.getConnection)().getCustomRepository(photographRepo_1.PhotographRepository);
        this.UserRepository = (0, typeorm_1.getConnection)().getCustomRepository(userRepo_1.UserRepository);
        this.LocationRepository = (0, typeorm_1.getConnection)().getCustomRepository(locationRepo_1.LocationRepository);
    }
    getPhotographs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.PhotographRepository.findAllPhotographs();
        });
    }
    getUserPhotographs({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req || !req.session || !req.session.userId) {
                return null;
            }
            const images = yield this.PhotographRepository.getFirstUserPhotographsAndCount(req.session.userId);
            return {
                images: images,
            };
        });
    }
    removePhotograph(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, typeorm_1.getConnection)().getRepository(Photograph_1.Photograph).delete({ id: id });
            return "success";
        });
    }
    deleteAllPhotographs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.PhotographRepository.removeAll();
            return "success";
        });
    }
    uploadImages({ req }, { ipfsLinks, transactionHashes }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.session.userId) {
                    return {
                        message: "User ID could not be found.",
                    };
                }
                const User = yield this.UserRepository.findByUserID(req.session.userId);
                if (!User) {
                    return {
                        message: "User could not be found.",
                    };
                }
                const { data } = yield axios_1.default.get(`http://ipinfo.io/json?token=${constants_1.IPINFO_KEY}`);
                if (!data) {
                    return {
                        message: "Location finder  service is unavailable at the moment.",
                    };
                }
                const location = yield this.LocationRepository.findLocation(data.city, data.region);
                if (!location) {
                    return {
                        message: "Location could not be found.",
                    };
                }
                let counter = 0;
                const images = [];
                for (const link of ipfsLinks) {
                    const photograph = new Photograph_1.Photograph();
                    photograph.imageLink = link;
                    photograph.transactionHash = transactionHashes[counter];
                    photograph.user = User;
                    photograph.location = location;
                    counter++;
                    images.push(photograph);
                    yield photograph.save();
                }
                return {
                    images: images,
                };
            }
            catch (error) {
                console.error(error);
                return {
                    message: "An error has occured.",
                };
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Photograph_1.Photograph]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "getPhotographs", null);
__decorate([
    (0, type_graphql_1.Query)(() => PhotographReturnType_1.PhotographReturnType, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "getUserPhotographs", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "removePhotograph", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "deleteAllPhotographs", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PhotographReturnType_1.PhotographReturnType),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)("inputs")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, uploadInputs_1.uploadInputs]),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "uploadImages", null);
PhotographResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PhotographResolver);
exports.PhotographResolver = PhotographResolver;
//# sourceMappingURL=photograph.js.map