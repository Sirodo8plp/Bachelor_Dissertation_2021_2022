import "../styles/style.css";
import type { AppProps } from "next/app";
import React from "react";
import Layout from "../components/layout";
import { Provider, createClient, dedupExchange, fetchExchange } from "urql";
import {
  cacheExchange,
  QueryInput,
  Cache,
  query,
} from "@urql/exchange-graphcache";
import { LoginMutation, MeDocument, MeQuery } from "../generated/graphql";

function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <React.Fragment>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </React.Fragment>
    </Provider>
  );
}
export default MyApp;
