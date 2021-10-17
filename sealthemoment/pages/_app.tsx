import '../styles/style.css';
import type { AppProps } from 'next/app'
import React from 'react'
import Layout from '../components/layout'
import {Provider, createClient} from 'urql';

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include"
  }
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
  )
}
export default MyApp
