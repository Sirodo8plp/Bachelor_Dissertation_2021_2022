import React from 'react';
import Link from 'next/link';
import Toggler from './toggler';

function Navbar() {
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
      </ul>
    </nav>
    )
}

export default Navbar;