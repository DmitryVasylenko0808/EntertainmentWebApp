import React from "react";

import { RiBookmarkLine, RiBookmarkFill } from "react-icons/ri";
import Button from "./Button.jsx";
import CardInfo from "./CardInfo.jsx";

import "../styles/Card.scss";

const Card = ({ type, media, bookmarked, onToggleMark }) => {
    let classNameCard = "list-block__card";
    let classNameImage = "list-block__img";

    if (type === "trending") {
        classNameCard += " trending-card";
        classNameImage += " trendimg";
    }
    return (
        <div className={classNameCard}>
            <div className={classNameImage} style={{backgroundImage: `url(http://localhost:3000/${media.picture})`}}>
                <div className="list-block__row">
                    <Button type="bookmarked-none" onClickHandler={onToggleMark}>
                        {!bookmarked ? <RiBookmarkLine size={20} /> : <RiBookmarkFill size={20} />}
                    </Button>
                </div>
                {type === "trending" ? <CardInfo {...media}/> : null }
            </div>
            {type !== "trending" ? <CardInfo {...media}/> : null }
        </div>
    )
}

export default Card;