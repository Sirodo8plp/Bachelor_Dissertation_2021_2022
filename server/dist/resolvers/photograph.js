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
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Photograph_1 = require("../entities/Photograph");
const photographRepo_1 = require("../repositories/photographRepo");
const cloudinary = __importStar(require("cloudinary"));
const graphql_upload_1 = require("graphql-upload");
const crypto_1 = __importDefault(require("crypto"));
const userRepo_1 = require("../repositories/userRepo");
const locationRepo_1 = require("../repositories/locationRepo");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
let PhotographError = class PhotographError {
};
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PhotographError.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PhotographError.prototype, "message", void 0);
PhotographError = __decorate([
    (0, type_graphql_1.ObjectType)()
], PhotographError);
let PhotographReturnType = class PhotographReturnType {
};
__decorate([
    (0, type_graphql_1.Field)(() => Photograph_1.Photograph, { nullable: true }),
    __metadata("design:type", Photograph_1.Photograph)
], PhotographReturnType.prototype, "photograph", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => PhotographError, { nullable: true }),
    __metadata("design:type", PhotographError)
], PhotographReturnType.prototype, "error", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String),
    __metadata("design:type", String)
], PhotographReturnType.prototype, "message", void 0);
PhotographReturnType = __decorate([
    (0, type_graphql_1.ObjectType)()
], PhotographReturnType);
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
    removePhotograph(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, typeorm_1.getConnection)().getRepository(Photograph_1.Photograph).delete({ id: id });
            return "success";
        });
    }
    uploadImage({ createReadStream }, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = crypto_1.default.randomBytes(20).toString("hex");
                const user = yield this.UserRepository.findOrFailByID(req.session.userId);
                const { data } = yield axios_1.default.get(`http://ipinfo.io/json?token=${constants_1.IPINFO_KEY}`);
                if (!data) {
                    return "An unexpected error has occured. Please, try again later!";
                }
                const location = yield this.LocationRepository.findLocation(data.city, data.region);
                if (!location) {
                    return "Location could not be found. Please, try again later.";
                }
                const upload_stream = cloudinary.v2.uploader.upload_stream({
                    tags: `${user.username}_photographs`,
                    folder: `${user.username}_folder`,
                    overwrite: true,
                }, function (err, image) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            console.error(err);
                        }
                        if (image) {
                            console.log(image);
                            try {
                                const photographExists = yield Photograph_1.Photograph.findOne({
                                    etag: image.etag,
                                });
                                if (!photographExists) {
                                    const photograph = new Photograph_1.Photograph();
                                    photograph.etag = image.etag;
                                    photograph.imageLink = image.url;
                                    photograph.user = user;
                                    photograph.location = location;
                                    yield photograph.save();
                                }
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                    });
                });
                const file_reader = createReadStream().pipe(upload_stream);
                return "Image was successfully uploaded.";
            }
            catch (error) {
                console.error("photograph entity: ", error);
                return "An internal server error has occured. That's all we know.";
            }
        });
    }
    deleteAllPhotographs() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.PhotographRepository.removeAll();
            return "success";
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
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "removePhotograph", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "uploadImage", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "deleteAllPhotographs", null);
PhotographResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PhotographResolver);
exports.PhotographResolver = PhotographResolver;
//# sourceMappingURL=photograph.js.map