import Link from "next/link";

const UserNavigation = () => {
  return (
    <nav className="user__navigation">
      <ul className="user__navList">
        <li>
          <Link href="/user">
            <a className="user__link">Upload</a>
          </Link>
        </li>
        <li>
          <Link href="/user/locations">
            <a className="user__link">Locations</a>
          </Link>
        </li>{" "}
        <li>
          <Link href="/user/photographs">
            <a className="user__link">Photographs</a>
          </Link>
        </li>
        <li>
          <Link href="/user/nfts">
            <a className="user__link">Postcards</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavigation;
