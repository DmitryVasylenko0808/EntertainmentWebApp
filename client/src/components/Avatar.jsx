import React from "react";

import Button from "./Button.jsx";

import "../styles/Avatar.scss";

const Avatar = ({ type, src, onClickHandler }) => {
    return (
        <>
            {type === "preview"
                ? (
                    <div className="preview-block">
                        <img src={src} className="preview-block__image" />
                    </div>
                )
                : (
                    <Button onClickHandler={onClickHandler}>
                        <img className="menu-avatar" src={src} />
                    </Button>
                )
            }
        </>

    )
}

export default Avatar;