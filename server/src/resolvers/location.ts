import axios from "axios";
import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getConnection } from "typeorm";
import { IPINFO_KEY } from "../constants";
import { Location } from "../entities/Location";
import { ipInfoData } from "../interfaces/ipInfoData";
import { LocationRepository } from "../repositories/locationRepo";
import { UserRepository } from "../repositories/userRepo";
import { DbContext } from "../types";
import { LocationReturnType } from "./locationMisc/LocationReturnType";

@ObjectType()
class getLocationData {
  @Field(() => [Location], { nullable: true })
  locations?: Location[];
  @Field(() => String, { nullable: true })
  error?: string;
}

@Resolver()
export class LocationResolver {
  LocationRepository = getConnection().getCustomRepository(LocationRepository);
  UserRepository = getConnection().getCustomRepository(UserRepository);
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
      const locationWithUsers = await this.LocationRepository.findLocation(
        data.city,
        data.region
      );

      const currentUser = await this.UserRepository.findOrFailByID(
        req.session.userId
      );

      if (!locationWithUsers) {
        //location does not exist.
        const location = await this.LocationRepository.insertLocation(
          data.city,
          data.region,
          currentUser
        );
        return { location: location.raw[0] };
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
      const location = await this.LocationRepository.findLocationByID(id);
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
      await this.LocationRepository.removeLocationByID(id);
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

  @Query(() => getLocationData)
  async locations(): Promise<getLocationData> {
    try {
      const locations = await this.LocationRepository.findAllLocations();
      if (!locations) {
        return {
          error: "An error has occured. Please, try again later!",
        };
      }
      return {
        locations: locations,
      };
    } catch (error) {
      console.error(error);
      return {
        error: "An error has occured. Please, try again later!",
      };
    }
  }
}
