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
      const newLocation = new Location();
      newLocation.city = data.city;
      newLocation.region = data.region;

      const user = await User.findOne({ userID: req.session.userId });
      if (user) {
        user.locations = [newLocation];
        await getConnection().manager.save(user);
        return {
          location: newLocation,
        };
      }
      throw new Error("User somehow is missing");
    } catch (error) {
      console.error(error);
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
      const location = await Location.findOne({ id: id });
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

  @Query(() => LocationReturnType)
  async getLocationByName(
    @Arg("name") name: string
  ): Promise<LocationReturnType> {
    try {
      const location = await Location.findOne({ city: name });
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
  async insertLocation({
    city,
    regionName,
  }: LocationDataInput): Promise<LocationReturnType> {
    try {
      const location = await Location.findOne({
        city: city,
        region: regionName,
      });
      if (location) {
        const error = {
          type: "locationAlreadyExists",
          message: `The city of ${city} Located in ${regionName} alreay exists in our Database.`,
        };
        return { error };
      }

      let newLocation = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Location)
        .values({ city: city, region: regionName })
        .returning("*")
        .execute();

      return newLocation.raw[0];
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
    return await Location.find({});
  }

  @Mutation(() => String)
  async deleteLocations(): Promise<string> {
    await Location.delete({});
    return "success";
  }
}
