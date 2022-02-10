"use strict";
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
const userRepo_1 = require("../repositories/userRepo");
const typeorm_1 = require("typeorm");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../constants");
const locationRepo_1 = require("../repositories/locationRepo");
const getUserAndLocation = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = (0, typeorm_1.getConnection)().getCustomRepository(userRepo_1.UserRepository);
    const locationRepository = (0, typeorm_1.getConnection)().getCustomRepository(locationRepo_1.LocationRepository);
    if (!id) {
        return {
            message: "User ID could not be found.",
        };
    }
    const myUser = yield userRepository.findByUserID(id);
    if (!myUser) {
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
    const location = yield locationRepository.findLocation(data.city, data.region);
    if (!location) {
        return {
            message: "Location could not be found.",
        };
    }
    return {
        user: myUser,
        location: location,
    };
});
exports.default = getUserAndLocation;
//# sourceMappingURL=getUserAndLocation.js.map