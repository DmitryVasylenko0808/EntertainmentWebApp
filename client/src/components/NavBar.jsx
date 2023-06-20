import React from "react";

import "../styles/NavBar.scss";

const NavBar = ({ children }) => {
    return (
        <nav className="menu-nav">
            <ul className="menu-nav__list">
                {children.map((element, i) => (<li className="menu-nav__item" key={i}>{element}</li>))}
            </ul>
        </nav>
    )
}

export default NavBar;