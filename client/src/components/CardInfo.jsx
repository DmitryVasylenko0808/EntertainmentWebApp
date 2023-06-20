import React from "react";

import { MdLocalMovies } from "react-icons/md";

const CardInfo = ({ year, type, title }) => {
    return (
        <div className="list-block__info">
            <div className="list-block__properties">
                <span className="list-block__property">{year}</span>
                <span className="list-block__circle"></span>
                <div className="list-block__type">
                    <MdLocalMovies size={16} /> {type}
                </div>
            </div>
            <div className="list-block__title">{title}</div>
        </div>
    )
}

export default CardInfo;