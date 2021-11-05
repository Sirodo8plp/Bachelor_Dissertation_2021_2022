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
exports.UploadResolver = void 0;
const type_graphql_1 = require("type-graphql");
const graphql_upload_1 = require("graphql-upload");
const User_1 = require("../entities/User");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const Location_1 = require("../entities/Location");
const typeorm_1 = require("typeorm");
const Photograph_1 = require("../entities/Photograph");
const fs_1 = require("fs");
const crypto_1 = __importDefault(require("crypto"));
let UploadResolver = class UploadResolver {
    uploadImage({ filename, createReadStream }, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const timestamp = crypto_1.default.randomBytes(20).toString("hex");
                const user = yield User_1.User.findOne({ id: req.session.userId });
                const { data } = yield axios_1.default.get(`http://ipinfo.io/json?token=${constants_1.IPINFO_KEY}`);
                if (!user || !data) {
                    return "An unexpected error has occured. Please, try again later!";
                }
                const location = yield Location_1.Location.findOne({
                    city: data.city,
                    region: data.region,
                });
                if (!location) {
                    return "Location could not be found. Please, try again later.";
                }
                const photograph = yield (0, typeorm_1.getConnection)()
                    .getRepository(Photograph_1.Photograph)
                    .create({
                    imageName: `${user.username}_${timestamp}_${filename}`,
                    user: user,
                    location: location,
                })
                    .save();
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    createReadStream()
                        .pipe((0, fs_1.createWriteStream)(`${__dirname}/../../images/${user.username + "_" + timestamp + "_" + filename}`))
                        .on("finish", () => resolve("Image was successfully uploaded!"))
                        .on("error", () => reject("An error has occured."));
                }));
            }
            catch (error) {
                console.error("upload entity: ", error);
                return "An internal server error has occured. That's all we know.";
            }
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)("image", () => graphql_upload_1.GraphQLUpload)),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UploadResolver.prototype, "uploadImage", null);
UploadResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UploadResolver);
exports.UploadResolver = UploadResolver;
//# sourceMappingURL=upload.js.map