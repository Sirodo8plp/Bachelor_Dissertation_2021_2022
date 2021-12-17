import React from "react";
import NFTdata from "../public/nft";
import Nft from "./nftCardInfo";
import Link from "next/link";
import { useMeQuery } from "../generated/graphql";

function mainContainer() {
  const [{ data, fetching }] = useMeQuery();
  let links = null;
  if (!fetching && !data?.me) {
    links = (
      <section className="main__linksContainer">
        <Link href="/register">
          <a className="main__link">Create your account now!</a>
        </Link>
        <Link href="/login">
          <a className="main__link">Sign In</a>
        </Link>
      </section>
    );
  } else {
    links = (
      <section className="main__linksContainer">
        <Link href="/user">
          <a className="main__link">Upload your photographs now!</a>
        </Link>
      </section>
    );
  }

  return (
    <main className="main">
      <h1 className="main__title">NFT Latest Information</h1>
      {NFTdata.map((info) => {
        return (
          <Nft key={info.id} header={info.header} message={info.message} />
        );
      })}
      <section className="main__linksContainer">{links}</section>
    </main>
  );
}

export default mainContainer;
