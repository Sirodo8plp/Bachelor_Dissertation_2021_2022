import { __prod__ } from "./constants";
import { Photograph } from "./entities/Photograph";
import { User } from "./entities/User";
import { Location } from "./entities/Location";
import { MikroORM } from "@mikro-orm/core";
import path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
  entities: [User, Location, Photograph],
  dbName: "sealthemoment",
  debug: !__prod__,
  type: "postgresql",
  password: "comlerpe64",
} as Parameters<typeof MikroORM.init>[0];
