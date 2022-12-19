import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import Image from "next/image";
import { LOGOUT_MUTATION } from "../graphql/mutations";
import { ME_QUERY } from "../graphql/queries";
import Toggler from "./NavigationToggler";
import { HiMenu } from "react-icons/hi";

function Navbar() {
  const router = useRouter();
  const { data } = useQuery(ME_QUERY);
  const [logout, {}] = useMutation(LOGOUT_MUTATION);
  const navbarElement = useRef<HTMLUListElement>(null);
  let actions = null;

  const redirectToProfile = () => {
    router.push("/user");
  };

  if (!data?.me) {
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
      <HiMenu
        className="navigation__button"
        color="#000000"
        onClick={expandMenu}
        height={250}
        width={250}
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

export default Navbar;
