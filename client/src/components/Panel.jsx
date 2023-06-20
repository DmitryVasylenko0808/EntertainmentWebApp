import React from "react";
import { MdPerson } from "react-icons/md";
import { RiSearchLine, RiLockPasswordLine, RiImageAddFill } from "react-icons/ri";

import "../styles/Panel.scss";

import "../styles/AuthForm.scss";

const Panel = ({ type = "text", onChangeHandler, placeholder, name, title }) => {
    let icon;
    let classNameContainer = "panel";
    let className = "panel__field"

    if (type === "search") {
        icon = <RiSearchLine size={30} />
    }
    else if (type === "login") {
        icon = <MdPerson size={30} />
        className += " auth-form__field";
    }
    else if (type === "password") {
        icon = <RiLockPasswordLine size={30} />
        className += " auth-form__field";
    }
    else if (type === "file") {
        classNameContainer = "panel-upload";
        className = "panel__imgfield";
    }

    const renderPanel = () => {
        if (type === "file") {
            return (
                <div className="panel__row">
                    <label className={classNameContainer}>
                        <RiImageAddFill size={24} />
                        Upload a file
                        <input
                            type="file"  
                            className={className}
                            onChange={(e) => onChangeHandler(e, e.target.files)} 
                            name={name} 
                        />
                    </label>
                    <label className="panel__imglabel">{title}</label>
                </div>
            )
        }
        else {
            return (
                <>
                    <label className="panel__label">{title}</label>
                    <div className={classNameContainer}>
                        {icon ? icon : null}
                        <input type={type}
                            className={className}
                            onChange={onChangeHandler}
                            placeholder={placeholder}
                            name={name}
                        />
                    </div>
                </>
            )
        }
    }

    return (
        renderPanel()
    )
}

export default Panel;