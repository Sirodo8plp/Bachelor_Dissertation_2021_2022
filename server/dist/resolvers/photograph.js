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
const Photograph_1 = require("../entities/Photograph");
const Location_1 = require("../entities/Location");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
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
    getPhotographs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Photograph_1.Photograph.find({
                where: {},
                relations: ["location", "user"],
            });
        });
    }
    insertPhotograph(value, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentUser = yield User_1.User.findOne({ id: req.session.userId });
                const { data } = yield axios_1.default.get(`http://ipinfo.io/json?token=${constants_1.IPINFO_KEY}`);
                if (!data) {
                    return {
                        error: {
                            type: "APIERROR",
                            message: "Your location could not be found. Please, try again later.",
                        },
                    };
                }
                const currentLocation = yield Location_1.Location.findOne({
                    city: data.city,
                    region: data.region,
                });
                const photograph = yield Photograph_1.Photograph.create({
                    value: Buffer.from(value, "utf-8"),
                    user: currentUser,
                    location: currentLocation,
                }).save();
                return {
                    photograph,
                };
            }
            catch (err) {
                console.error(err);
                return {
                    error: {
                        type: "ExceptionOccured",
                        message: "An internal server occured. That's all we know.",
                    },
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
    (0, type_graphql_1.Mutation)(() => PhotographReturnType),
    __param(0, (0, type_graphql_1.Arg)("base64value")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PhotographResolver.prototype, "insertPhotograph", null);
PhotographResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PhotographResolver);
exports.PhotographResolver = PhotographResolver;
//# sourceMappingURL=photograph.js.map