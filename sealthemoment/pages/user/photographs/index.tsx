import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import CreatePostcard from "../../../components/createPostcard";
import PhotographsContainer from "../../../components/photographsContainer";
import UserNavigation from "../../../components/usernav";
import { GET_PHOTO_INFO_QUERY } from "../../../graphql/queries";
import { useIsAuth } from "../../../utils/userIsAuth";

type photograph =
  | {
      __typename?: "Photograph" | undefined;
      imageLink: string;
      location: {
        __typename?: "Location" | undefined;
        city: string;
        region: string;
      };
    }[]
  | null
  | undefined;
type setPhotographs = React.Dispatch<React.SetStateAction<photograph>> | null;
export const PhotographsContext = React.createContext<photograph>(null);
export const SetPhotographsContext = React.createContext<setPhotographs>(null);
export const selectedContext = React.createContext<string[] | null>(null);
export const setSelectedContext = React.createContext<React.Dispatch<
  React.SetStateAction<string[] | null>
> | null>(null);

const Photographs = () => {
  useIsAuth();
  const [photographs, setPhotographs] = useState<photograph | null>([]);
  const [selectedPhotographs, setSelectedPhotographs] = useState<
    string[] | null
  >(new Array());
  const { data, loading } = useQuery(GET_PHOTO_INFO_QUERY);
  useEffect(() => {
    if (
      !loading &&
      data &&
      data.getUserPhotographs &&
      data.getUserPhotographs.images
    ) {
      setPhotographs(data.getUserPhotographs.images);
    }
  }, [loading]);
  return (
    <PhotographsContext.Provider value={photographs}>
      <SetPhotographsContext.Provider value={setPhotographs}>
        <selectedContext.Provider value={selectedPhotographs}>
          <setSelectedContext.Provider value={setSelectedPhotographs}>
            <UserNavigation selected="photographs" />
            {photographs!.length > 0 && <PhotographsContainer />}
            {selectedPhotographs!.length > 0 && <CreatePostcard />}
            {!photographs && (
              <h1 className="postcards__Heading">
                You have not minted any photographs yet!
              </h1>
            )}
          </setSelectedContext.Provider>
        </selectedContext.Provider>
      </SetPhotographsContext.Provider>
    </PhotographsContext.Provider>
  );
};

export default Photographs;
