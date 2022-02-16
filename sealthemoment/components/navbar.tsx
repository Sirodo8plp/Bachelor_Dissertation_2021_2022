import React, { EventHandler, useRef, useState } from "react";
import Link from "next/link";
import Toggler from "./NavigationToggler";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";
import { MenuOutline } from "react-ionicons";

function Navbar() {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [, logout] = useLogoutMutation();
  const navbarElement = useRef<HTMLUListElement>(null);
  let actions = null;

  const redirectToProfile = () => {
    router.push("/user");
  };

  if (fetching) {
  } else if (!data?.me) {
    actions = (
      <>
        <li>
          <Link href="/login">
            <a className="navigation__link">Login</a>
          </Link>
        </li>
        <li>
          <Link href="/register">
            <a className="navigation__link">Sign Up</a>
          </Link>
        </li>
      </>
    );
  } else {
    actions = (
      <>
        <li>
          <Link href="/">
            <a
              className="navigation__link"
              onClick={async () => {
                await logout();
                router.push("/");
              }}
            >
              Logout
            </a>
          </Link>
        </li>
        <li>
          <div className="navUser" onClick={redirectToProfile}>
            <p className="navUser__text">Logged In as #{data.me.username}</p>
          </div>
        </li>
      </>
    );
  }

  const expandMenu = () => {
    if (
      navbarElement.current!.classList.contains("navigation__list--expanded")
    ) {
      navbarElement.current!.classList.remove("navigation__list--expanded");
      return;
    }
    navbarElement.current!.classList.add("navigation__list--expanded");
  };

  return (
    <nav className="navigation">
      <MenuOutline
        color={"#00000"}
        height="250px"
        width="250px"
        cssClasses={"navigation__button"}
        onClick={expandMenu}
      />
      <ul className="navigation__list" ref={navbarElement}>
        <li>
          <Link href="/">
            <a className="navigation__link">Home</a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a className="navigation__link">About</a>
          </Link>
        </li>
        <li>
          <Toggler />
        </li>
        {actions}
      </ul>
    </nav>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Navbar);
