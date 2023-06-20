import React, { useEffect, useState } from "react";
import axios from "axios";

import { signIn, signUp } from "../http/usersApi.js";

import Panel from "./Panel.jsx";
import Button from "./Button.jsx";
import Avatar from "./Avatar.jsx";
import { RiCloseFill } from "react-icons/ri";

import "../styles/AuthForm.scss";

const AuthForm = ({ onCloseForm, logIn }) => {
    const [type, setType] = useState('login');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [previewAvatar, setPreviewAvatar] = useState(null);

    const onSignUp = async (e) => {
        e.preventDefault();

        const form = e.target;

        const formData = new FormData();
        formData.append("login", form.login.value);
        formData.append("password", form.password.value);
        formData.append("repeatPassword", form.repeatPassword.value);
        formData.append("avatar", form.avatar.files[0]);

        try {   
            const succesMessage = await signUp(formData);
            setSuccess(succesMessage);
            setError('');
        }
        catch (e) {
            const { errorMessage } = e.response.data;
            setError(errorMessage);
        }
    }

    const onSignIn = async (e) => {
        e.preventDefault();

        const form = e.target;

        const formData = new FormData();
        formData.append("login", form.login.value);
        formData.append("password", form.password.value);

        try {
            const token = await signIn(formData);
            logIn(token);
            onCloseForm();
        }
        catch (e) {
            const { errorMessage } = e.response.data;
            setError(errorMessage);
        }
    }

    const onShowPreviewAvatar = (e, imgFile) => {
        e.preventDefault();
        imgFile = imgFile[0];

        console.log(imgFile);

        const reader = new FileReader();
        reader.addEventListener("load", () => {
            setPreviewAvatar(reader.result);
        });
        reader.readAsDataURL(imgFile); 
    }

    const navToType = (e, typeValue) => {
        e.preventDefault();
        setType(typeValue);
        setPreviewAvatar(null);
        setError('');
    }

    return (
        <form onSubmit={type === 'login' ? onSignIn : onSignUp} className="auth-form">
            <Button onClickHandler={onCloseForm} type="close-form">
                <RiCloseFill size={32} />
            </Button>
            <div className="auth-form__title">
                {type === "registration" ? "Registration" : "Log In"}
            </div>

            <div className="auth-tabs">
                <Button
                    onClickHandler={(e) => navToType(e, 'login')}
                    type="auth-tab"
                    active={type === "login" ? true : false}
                >
                    Sign In
                </Button>
                <Button
                    onClickHandler={(e) => navToType(e, 'registration')}
                    type="auth-tab"
                    active={type === "registration" ? true : false}
                >
                    Registration
                </Button>
            </div>

            <Panel
                type="login"
                placeholder="Enter your login"
                name="login"
                title="Login"
            />
            <Panel
                type="password"
                placeholder="Enter your password"
                name="password"
                title="Password"
            />
            {type === "registration" 
                ? (
                    <>
                        <Panel
                            type="password"
                            placeholder="Enter your password"
                            name="repeatPassword"
                            title="Repeat password"
                        />
                        <Panel
                            type="file"
                            name="avatar"
                            title="Upload your avatar"
                            onChangeHandler={onShowPreviewAvatar}
                        />
                        {previewAvatar 
                            ? <Avatar type="preview" src={previewAvatar} /> 
                            : null  
                        }
                        
                    </>
                ) : null}

            {success ? <div className="auth-form__success">{success}</div> : null}
            {error ? <div className="auth-form__error">{error}</div> : null}

            <div className="auth-form__btn-container">
                {type === "registration" ?
                    <Button type="auth-submit">Sign Up</Button>
                    : <Button type="auth-submit">Sign In</Button>}
            </div>
        </form>
    )
}

export default AuthForm;