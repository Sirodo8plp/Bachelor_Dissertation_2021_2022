import type { NextPage } from "next";
import Navbar from "../components/navbar";
import Header from "../components/header";
import Main from "../components/mainC";
import Footer from "../components/footer";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <Main />
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Home);
