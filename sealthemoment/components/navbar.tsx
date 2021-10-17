import React, { useState } from "react";
import Link from "next/link";
import Toggler from "./toggler";
import { useMeQuery } from "../generated/graphql";

function Navbar() {
  const [{ data, fetching }] = useMeQuery();
  const [loading, setLoading] = useState(true);
  let actions = null;

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
          <Link href="/logout">
            <a className="navigation__link">Logout</a>
          </Link>
        </li>
        <li>
          <div className="navUser">
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

export default Navbar;
