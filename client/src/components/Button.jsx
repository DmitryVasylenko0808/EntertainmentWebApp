import React from "react";

const Button = ({ type, onClickHandler, active, children }) => {
    let className = "";
    if (type === "auth") {
        className += "menu__sign";
    }
    else if (type === "auth-submit") {
        className += "auth-form__btn";
    }
    else if (type === "auth-tab") {
        className += "auth-tab";
    }
    else if (type === "close-form") {
        className += "auth-form__btn-close";
    }
    else if (type === "bookmarked-none") {
        className += "list-block__bookmark";
    }

    if (active === true) {
        className += " active"
    }

    return (
        <button onClick={onClickHandler} className={className}>{children}</button>
    )
}

export default Button;