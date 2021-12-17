import React, { EventHandler, useState } from "react";
import Link from "next/link";
import Toggler from "./NavigationToggler";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

function Navbar() {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [, logout] = useLogoutMutation();
  const [loading, setLoading] = useState(true);
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
                router.reload();
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

  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <li>
          <Link href="/">
            <a className="navigation__link">Home</a>
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
