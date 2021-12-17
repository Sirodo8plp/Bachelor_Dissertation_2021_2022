"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeORMoptions = void 0;
const Location_1 = require("./entities/Location");
const User_1 = require("./entities/User");
const Photograph_1 = require("./entities/Photograph");
exports.typeORMoptions = {
    type: "postgres",
    database: "sealthemoment2",
    username: "postgres",
    password: "comlerpe64",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Location_1.Location, Photograph_1.Photograph],
};
//# sourceMappingURL=typeorm.js.map