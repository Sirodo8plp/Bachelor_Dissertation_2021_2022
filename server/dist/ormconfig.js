"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Location_1 = require("./entities/Location");
const User_1 = require("./entities/User");
const Photograph_1 = require("./entities/Photograph");
module.exports = {
    type: "postgres",
    database: "sealthemoment2",
    username: "postgres",
    password: "comlerpe64",
    synchronize: true,
    logging: true,
    entities: [User_1.User, Location_1.Location, Photograph_1.Photograph],
};
//# sourceMappingURL=ormconfig.js.map