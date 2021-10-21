import { Location } from "./entities/Location";
import { User } from "./entities/User";
import { Photograph } from "./entities/Photograph";

module.exports = {
  type: "postgres",
  database: "sealthemoment2",
  username: "postgres",
  password: "comlerpe64",
  synchronize: true,
  logging: true,
  entities: [User, Location, Photograph],
};
