"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Photograph_1 = require("./entities/Photograph");
const User_1 = require("./entities/User");
const Location_1 = require("./entities/Location");
const path_1 = __importDefault(require("path"));
exports.default = {
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [User_1.User, Location_1.Location, Photograph_1.Photograph],
    dbName: "sealthemoment",
    debug: !constants_1.__prod__,
    type: "postgresql",
    password: "comlerpe64",
};
//# sourceMappingURL=mikro-orm.config.js.map