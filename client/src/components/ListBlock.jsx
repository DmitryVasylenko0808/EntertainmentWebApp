import React, { Children } from "react";

import Card from "./Card.jsx";

import "../styles/ListBlock.scss";

const ListBlock = ({ type, title, children }) => {
    let classNameContainer = "list-block__container";

    if (type === "trending") {
        classNameContainer += " trending";
    }

    return (
        <div className="list-block">
            <div className="list-block__heading">{title}</div>
            <div className={classNameContainer}>
                {children}
            </div>
        </div>
    )
}

export default ListBlock;