import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";

interface Props {
  children: JSX.Element;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Navbar pageProps={undefined} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
