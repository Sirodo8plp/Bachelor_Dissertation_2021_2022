import { GetServerSideProps } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import { useGetLocationsQuery } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useIsAuth } from "../../../utils/userIsAuth";
const Locations = () => {
  useIsAuth();
  const [{ data, fetching }] = useGetLocationsQuery();
  if (!fetching && data && data.locations) {
    return (
      <main className="location__container">
        {data.locations.map((location) => {
          return (
            <article key={location.id} className="location__mark">
              <p>Region: {location.region}</p>
              <p>City: {location.city}</p>
              <p>Photographs took there: {location.photographs.length}</p>
            </article>
          );
        })}
      </main>
    );
  }
  return <h1 className="location__heading">Getting location data ready!</h1>;
};

// export async const getStaticProps = (ctx) => {
//   const ssrCache = ssrExchange({ isClient: false });
//   const client = initUrqlClient({
//     url: "your-url",
//     exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange],
//   });

//   // This query is used to populate the cache for the query
//   // used on this page.
//   await client.query(TODOS_QUERY).toPromise();

//   return {
//     props: {
//       // urqlState is a keyword here so withUrqlClient can pick it up.
//       urqlState: ssrCache.extractData(),
//     },
//     revalidate: 600,
//   };
// }

export default withUrqlClient(createUrqlClient, { ssr: true })(Locations);
