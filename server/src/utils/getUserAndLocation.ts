import { UserRepository } from "../repositories/userRepo";
import { getConnection } from "typeorm";
import { Location } from "../entities/Location";
import { User } from "../entities/User";
import { ipInfoData } from "../interfaces/ipInfoData";
import axios from "axios";
import { IPINFO_KEY } from "../constants";
import { LocationRepository } from "../repositories/locationRepo";

interface returnType {
  user?: User;
  location?: Location;
  message?: string;
}

const getUserAndLocation = async (
  id: number | undefined
): Promise<returnType> => {
  const userRepository = getConnection().getCustomRepository(UserRepository);
  const locationRepository =
    getConnection().getCustomRepository(LocationRepository);
  if (!id) {
    return {
      message: "User ID could not be found.",
    };
  }
  const myUser = await userRepository.findByUserID(id);
  if (!myUser) {
    return {
      message: "User could not be found.",
    };
  }
  const { data }: ipInfoData = await axios.get(
    `http://ipinfo.io/json?token=${IPINFO_KEY}`
  );
  if (!data) {
    return {
      message: "Location finder  service is unavailable at the moment.",
    };
  }
  const location = await locationRepository.findLocation(
    data.city,
    data.region
  );

  if (!location) {
    return {
      message: "Location could not be found.",
    };
  }

  return {
    user: myUser,
    location: location,
  };
};

export default getUserAndLocation;
