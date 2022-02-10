import Link from "next/link";
import React from "react";
import NotificationSystem from "./notificationButton";

interface navProps {
  selected: string;
}

const UserNavigation: React.FC<navProps> = ({ selected }) => {
  return (
    <nav className="user__navigation">
      <ul className="user__navList">
        <li>
          <Link href="/user">
            <a
              className={
                selected === "upload"
                  ? "user__link user__link--selected"
                  : "user__link"
              }
            >
              Upload
            </a>
          </Link>
        </li>
        <li>
          <Link href="/user/locations">
            <a
              className={
                selected === "locations"
                  ? "user__link user__link--selected"
                  : "user__link"
              }
            >
              Locations
            </a>
          </Link>
        </li>{" "}
        <li>
          <Link href="/user/photographs">
            <a
              className={
                selected === "photographs"
                  ? "user__link user__link--selected"
                  : "user__link"
              }
            >
              Photographs
            </a>
          </Link>
        </li>
        <li>
          <Link href="/user/postcards">
            <a
              className={
                selected === "postcards"
                  ? "user__link user__link--selected"
                  : "user__link"
              }
            >
              Postcards
            </a>
          </Link>
        </li>
        {selected === "upload" && <NotificationSystem />}
      </ul>
    </nav>
  );
};

export default UserNavigation;
