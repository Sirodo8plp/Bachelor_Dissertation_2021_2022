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
Object.defineProperty(exports, "__esModule", { value: true });
exports.locationResolver = void 0;
const Location_1 = require("src/entities/Location");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const LocationDataInput_1 = require("./locationMisc/LocationDataInput");
const LocationReturnType_1 = require("./locationMisc/LocationReturnType");
let locationResolver = class locationResolver {
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
    insertLocation({ city, regionName, zipCode, }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const location = yield Location_1.Location.findOne({
                    city: city,
                    regionName: regionName,
                    zipCode: zipCode,
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
                    .values({ city: city, regionName: regionName, zipCode: zipCode })
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
};
__decorate([
    (0, type_graphql_1.Query)(() => LocationReturnType_1.LocationReturnType),
    __param(0, (0, type_graphql_1.Arg)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], locationResolver.prototype, "getLocationById", null);
__decorate([
    (0, type_graphql_1.Query)(() => LocationReturnType_1.LocationReturnType),
    __param(0, (0, type_graphql_1.Arg)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], locationResolver.prototype, "getLocationByName", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LocationReturnType_1.LocationReturnType),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LocationDataInput_1.LocationDataInput]),
    __metadata("design:returntype", Promise)
], locationResolver.prototype, "insertLocation", null);
locationResolver = __decorate([
    (0, type_graphql_1.ObjectType)()
], locationResolver);
exports.locationResolver = locationResolver;
//# sourceMappingURL=location.js.map