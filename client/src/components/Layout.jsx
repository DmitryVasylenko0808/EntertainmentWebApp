import React, { createContext, useContext, useState } from "react";

import { MdMovieCreation, MdLocalMovies, MdPerson } from "react-icons/md";
import { RiLayoutGridFill, RiTvFill, RiBookmarkFill } from "react-icons/ri";
import { Outlet, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";

import NavBar from "./NavBar.jsx";
import Button from "./Button.jsx";
import AuthForm from "./AuthForm.jsx";
import Avatar from "./Avatar.jsx";
import BlockLogOut from "./BlockLogOut.jsx";

import { AuthTokenContext, LoginAuthFormContext } from "../contexts/AuthTokenContext.js";
import { fetchAvatar } from "../http/usersApi.js";

const Layout = () => {
    const [formLogin, setFormLogin] = useState(false);
    const [blockLogOut, setBlockLogOut] = useState(false);
    const [background, setBackground] = useState(false);
    const [authToken, setAuthToken] = useState('');
    const [avatarPath, setAvatarPath] = useState(null);
    const navigate = useNavigate();

    const getAvatar = async (authToken) => {
        let fileAvatarPath;

        try {
            fileAvatarPath = await fetchAvatar(authToken);
        }
        catch (e) {
            fileAvatarPath = e.response.data.fileAvatarPath;
        }
        
        setAvatarPath(`http://localhost:3000${fileAvatarPath}`);
    } 

    const toggleFormLogin = (bool) => {
        setFormLogin(bool);
        setBackground(bool);
    }

    const toggleBlockLogOut = (bool) => {
        setBlockLogOut(bool);
        setBackground(bool);
    }

    const logIn = (authToken) => {
        setAuthToken(authToken);
        getAvatar(authToken);
    }

    const logOut = () => {
        setAuthToken('');
        setBlockLogOut(false);
        setBackground(false);
        navigate("/");
    }

    const renderAvatar = () => {
        if (!authToken) {
            return (
                <Button onClickHandler={() => toggleFormLogin(true)} type="auth">
                    <MdPerson size={36} />
                </Button>
            )
        }
        else {
            return (
                <Avatar
                    src={avatarPath}
                    onClickHandler={() => toggleBlockLogOut(!blockLogOut)}
                />
            )
        }
    }

    const renderAuthForm = () => {
        if (!formLogin) {
            return null;
        }
        else {
            return (
                <AuthForm
                    onCloseForm={() => toggleFormLogin(false)}
                    logIn={logIn}
                />
            )
        }
    }

    const renderBlockLogOut = () => {
        if (!blockLogOut) {
            return null;
        }
        else {
            return (
                <BlockLogOut
                    onCancel={() => toggleBlockLogOut(false)}
                    onSubmit={logOut}
                />
            )
        }
    }

    return (
        <div className="_container">
            <div className={!background ? "menu" : "menu _lessopacity"}>
                <MdMovieCreation size={48} color="red" className="menu__logo" />
                <NavBar>
                    <NavLink to="/" className="menu-nav__link">
                        <RiLayoutGridFill size={30} />
                    </NavLink>
                    <NavLink to="/movies" className="menu-nav__link">
                        <MdLocalMovies size={30} />
                    </NavLink>
                    <NavLink to="/tvseries" className="menu-nav__link">
                        <RiTvFill size={30} />
                    </NavLink>
                    <NavLink to="/bookmarked" className="menu-nav__link">
                        <RiBookmarkFill size={30} />
                    </NavLink>
                </NavBar>
                {renderAvatar()}
            </div>
            <AuthTokenContext.Provider value={authToken}>
                <LoginAuthFormContext.Provider value={() => toggleFormLogin(true)}>
                    <div className={!background ? "main" : "main _lessopacity"}>
                        <Outlet />
                    </div>
                    {renderAuthForm()}
                    {renderBlockLogOut()}
                </LoginAuthFormContext.Provider>
            </AuthTokenContext.Provider>
        </div>
    )
}

export default Layout;