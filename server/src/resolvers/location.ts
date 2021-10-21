import { Location } from "src/entities/Location";
import { Arg, Mutation, ObjectType, Query } from "type-graphql";
import { getConnection } from "typeorm";
import { LocationDataInput } from "./locationMisc/LocationDataInput";
import { LocationReturnType } from "./locationMisc/LocationReturnType";

@ObjectType()
export class locationResolver {
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
    zipCode,
  }: LocationDataInput): Promise<LocationReturnType> {
    try {
      const location = await Location.findOne({
        city: city,
        regionName: regionName,
        zipCode: zipCode,
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
        .values({ city: city, regionName: regionName, zipCode: zipCode })
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
}
