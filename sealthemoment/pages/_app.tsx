import "../styles/style.css";
import type { AppProps } from "next/app";
import React from "react";
import Layout from "../components/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <React.Fragment>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </React.Fragment>
  );
}
export default MyApp;
