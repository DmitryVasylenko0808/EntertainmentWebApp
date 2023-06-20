import React from "react";

import { Route, Routes } from "react-router-dom";

import "../styles/normalize.scss";
import "../styles/styles.scss";

import Layout from "./Layout.jsx";
import Main from "../pages/Main.jsx";
import Movies from "../pages/Movies.jsx";
import TvSeries from "../pages/TvSeries.jsx";
import BookMarked from "../pages/BookMarked.jsx";

const App = () => {
    return (
        <React.StrictMode>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Main />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/tvseries" element={<TvSeries />} />
                    <Route path="/bookmarked" element={<BookMarked />} />
                </Route>
            </Routes>
        </React.StrictMode>
        
    )
}

export default App;