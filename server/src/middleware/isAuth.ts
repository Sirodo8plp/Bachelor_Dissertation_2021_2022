import { MiddlewareFn } from "type-graphql";
import { DbContext } from "../types";

export const isAuth: MiddlewareFn<DbContext> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("User is not authenticated.");
  }

  return next();
};
