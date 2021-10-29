import axios from "axios";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { IPINFO_KEY } from "../constants";
import { Location } from "../entities/Location";
import { User } from "../entities/User";
import { DbContext } from "../types";
import { LocationDataInput } from "./locationMisc/LocationDataInput";
import { LocationReturnType } from "./locationMisc/LocationReturnType";

interface ipInfoData {
  data: {
    ip: string;
    hostname: string;
    city: string;
    region: string;
    country: string;
    loc: string;
    org: string;
    timezone: string;
  };
}

@Resolver()
export class LocationResolver {
  @Mutation(() => LocationReturnType)
  async updateLocation(@Ctx() { req }: DbContext): Promise<LocationReturnType> {
    try {
      const { data }: ipInfoData = await axios.get(
        `http://ipinfo.io/json?token=${IPINFO_KEY}`
      );
      if (!data) {
        return {
          error: {
            type: "APIERROR",
            message:
              "Your location could not be found. Please, try again later.",
          },
        };
      }
      const locationWithUsers = await Location.findOne({
        where: {
          city: data.city,
          region: data.region,
        },
        relations: ["users"],
      });

      const currentUser = await User.findOneOrFail({
        id: req.session.userId,
      });

      if (!locationWithUsers) {
        //location does not exist.
        const location = await getConnection()
          .getRepository(Location)
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
        const location = await locationWithUsers.save();
        return { location };
      }
      return {
        location: locationWithUsers,
      };
    } catch (error) {
      console.error("ENTITY LOCATION: location.ts", error);
      return {
        error: {
          type: "internalServerError",
          message: "An internal server error has occured.That's all we know.",
        },
      };
    }
  }

  @Query(() => LocationReturnType)
  async getLocationById(@Arg("id") id: number): Promise<LocationReturnType> {
    try {
      const location = await Location.findOne({
        where: { id: id },
        relations: ["users", "photographs"],
      });
      return { location };
    } catch (err) {
      console.log(err);
      const error = {
        type: "Internal Server Error",
        message: "An unexpected error occured.",
      };
      return { error };
    }
  }

  @Mutation(() => LocationReturnType)
  async removeLocation(@Arg("id") id: number): Promise<LocationReturnType> {
    try {
      await Location.delete({ id: id });
      let message = "Location was sucessfully deleted.";
      return { message };
    } catch (err) {
      const error = {
        type: "error500",
        message: "An intenal server error has occured.",
      };
      return { error };
    }
  }

  @Query(() => [Location])
  async locations(): Promise<Location[]> {
    return await Location.find({ relations: ["users"] });
  }

  @Mutation(() => String)
  async deleteLocations(): Promise<string> {
    await Location.delete({});
    return "success";
  }
}
