import { GetServerSideProps } from "next";
import { initUrqlClient, withUrqlClient } from "next-urql";
import React from "react";
import UserNavigation from "../../../components/usernav";
import { useGetLocationsQuery } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useIsAuth } from "../../../utils/userIsAuth";
import { GetLocationsQuery } from "../../../generated/graphql";
import {
  cacheExchange,
  ClientOptions,
  dedupExchange,
  fetchExchange,
  ssrExchange,
} from "urql";

type propsType = {
  [key: string]: any;
};

const Locations = (props: propsType) => {
  useIsAuth();
  const [{ data, fetching }] = useGetLocationsQuery();
  if (!fetching && data && data.locations && data.locations.locations) {
    return (
      <>
        <UserNavigation selected="locations" />
        <main className="location__container">
          {data.locations.locations.map((location) => {
            return (
              <article key={location.id} className="location">
                <h3>Region</h3>
                <p>{location.region}</p>
                <h3>City</h3>
                <p>{location.city}</p>
                <h3>Photographs took there</h3>
                <p>{location.photographs.length}</p>
              </article>
            );
          })}
        </main>
      </>
    );
  }
  return (
    <>
      <UserNavigation selected="locations" />
      <h1 className="location__heading">Getting location data ready!</h1>
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Locations);
