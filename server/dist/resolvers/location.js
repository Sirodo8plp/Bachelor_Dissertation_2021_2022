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
exports.LocationResolver = void 0;
const axios_1 = __importDefault(require("axios"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const constants_1 = require("../constants");
const Location_1 = require("../entities/Location");
const User_1 = require("../entities/User");
const LocationDataInput_1 = require("./locationMisc/LocationDataInput");
const LocationReturnType_1 = require("./locationMisc/LocationReturnType");
let LocationResolver = class LocationResolver {
    updateLocation({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.get(`http://ipinfo.io/json?token=${constants_1.IPINFO_KEY}`);
                if (!data) {
                    return {
                        error: {
                            type: "APIERROR",
                            message: "Your location could not be found. Please, try again later.",
                        },
                    };
                }
                const locationWithUsers = yield Location_1.Location.findOne({
                    where: {
                        city: data.city,
                        region: data.region,
                    },
                    relations: ["users"],
                });
                const currentUser = yield User_1.User.findOneOrFail({
                    id: req.session.userId,
                });
                if (!locationWithUsers) {
                    const location = yield (0, typeorm_1.getConnection)()
                        .getRepository(Location_1.Location)
                        .create({
                        city: data.city,
                        region: data.region,
                        users: [currentUser],
                    })
                        .save();
                    return { location };
                }
                let userHasBeenInThisLocationIndex = -1;
                for (let i = 0; i < locationWithUsers.users.length; i++) {
                    if (locationWithUsers.users[i].id === req.session.userId) {
                        userHasBeenInThisLocationIndex = i;
                        break;
                    }
                }
                if (userHasBeenInThisLocationIndex === -1) {
                    locationWithUsers.users.push(currentUser);
                    const location = yield locationWithUsers.save();
                    return { location };
                }
                return {
                    location: locationWithUsers,
                };
            }
            catch (error) {
                console.error("ENTITY LOCATION: location.ts", error);
                return {
                    error: {
                        type: "internalServerError",
                        message: "An internal server error has occured.That's all we know.",
                    },
                };
            }
        });
    }
    getLocationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield Location_1.Location.findOne({ id: id });
                return { location };
            }
            catch (err) {
                console.log(err);
                const error = {
                    type: "Internal Server Error",
                    message: "An unexpected error occured.",
                };
                return { error };
            }
        });
    }
    getLocationByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield Location_1.Location.findOne({ city: name });
                return { location };
            }
            catch (err) {
                console.log(err);
                const error = {
                    type: "Internal Server Error",
                    message: "An unexpected error occured.",
                };
                return { error };
            }
        });
    }
    insertLocation({ city, regionName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield Location_1.Location.findOne({
                    city: city,
                    region: regionName,
                });
                if (location) {
                    const error = {
                        type: "locationAlreadyExists",
                        message: `The city of ${city} Located in ${regionName} alreay exists in our Database.`,
                    };
                    return { error };
                }
                let newLocation = yield (0, typeorm_1.getConnection)()
                    .createQueryBuilder()
                    .insert()
                    .into(Location_1.Location)
                    .values({ city: city, region: regionName })
                    .returning("*")
                    .execute();
                return newLocation.raw[0];
            }
            catch (err) {
                console.log(err);
                const error = {
                    type: "Internal Server Error",
                    message: "An unexpected error occured.",
                };
                return { error };
            }
        });
    }
    removeLocation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Location_1.Location.delete({ id: id });
                let message = "Location was sucessfully deleted.";
                return { message };
            }
            catch (err) {
                const error = {
                    type: "error500",
                    message: "An intenal server error has occured.",
                };
                return { error };
            }
        });
    }
    locations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Location_1.Location.find({ relations: ["users"] });
        });
    }
    deleteLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Location_1.Location.delete({});
            return "success";
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => LocationReturnType_1.LocationReturnType),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "updateLocation", null);
__decorate([
    (0, type_graphql_1.Query)(() => LocationReturnType_1.LocationReturnType),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "getLocationById", null);
__decorate([
    (0, type_graphql_1.Query)(() => LocationReturnType_1.LocationReturnType),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "getLocationByName", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LocationReturnType_1.LocationReturnType),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LocationDataInput_1.LocationDataInput]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "insertLocation", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LocationReturnType_1.LocationReturnType),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "removeLocation", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Location_1.Location]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "locations", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationResolver.prototype, "deleteLocations", null);
LocationResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], LocationResolver);
exports.LocationResolver = LocationResolver;
//# sourceMappingURL=location.js.map