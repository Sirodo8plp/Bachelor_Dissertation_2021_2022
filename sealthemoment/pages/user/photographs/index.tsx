import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import UserNavigation from "../../../components/usernav";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetUserPhotographsQuery } from "../../../generated/graphql";
import { useIsAuth } from "../../../utils/userIsAuth";
import Photograph from "../../../components/photograph";

const Photographs = () => {
  useIsAuth();
  const [photographs, setPhotographs] = useState<Array<string> | null>(null);
  const [{ data, fetching }] = useGetUserPhotographsQuery();
  if (!fetching && data?.getUserPhotographs) {
    return (
      <>
        <UserNavigation selected="photographs" />
        {data!.getUserPhotographs!.map((link, index) => {
          return (
            <Photograph
              link={link.imageLink}
              id={"checkbox".concat(index.toString())}
              photographs={photographs}
              setPhotographs={setPhotographs}
            />
          );
        })}
      </>
    );
  }
  return (
    <>
      <UserNavigation selected="photographs" />
      <div>Hello World</div>;
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Photographs);
