"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Photographs_1 = require("./entities/Photographs");
const User_1 = require("./entities/User");
const VisitedLocations_1 = require("./entities/VisitedLocations");
const Locations_1 = require("./entities/Locations");
const path_1 = __importDefault(require("path"));
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [User_1.User, Locations_1.Location, Photographs_1.Photograph, VisitedLocations_1.VisitedLocation],
    dbName: "sealthemoment",
    debug: !constants_1.__prod__,
    type: "postgresql",
    password: "comlerpe64"
};
//# sourceMappingURL=mikro-orm.config.js.map