import React from "react";
import Button from "./Button.jsx";

import "../styles/BlockLogOut.scss";

const BlockLogOut = ({ onCancel, onSubmit }) => {
    return (
        <div className="block-logout">
            <div className="block-logout__title">Do you really want to quit?</div>
            <div className="block-logout__row">
                <Button onClickHandler={onCancel} type="auth-submit">No</Button>
                <Button onClickHandler={onSubmit} type="auth-submit">Yes</Button>
            </div>
        </div>
    )
}

export default BlockLogOut;