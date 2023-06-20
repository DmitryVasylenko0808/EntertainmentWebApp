import React, { useEffect, useContext, useState } from "react";

import Panel from "../components/Panel.jsx";
import ListBlock from "../components/ListBlock.jsx";
import Card from "../components/Card.jsx";

import { AuthTokenContext, LoginAuthFormContext } from "../contexts/AuthTokenContext";
import { addMarkMedia, 
    deleteMarkMedia, 
    fetchMediasByType, 
    fetchMarkedMedias, 
    fetchSearchedMarkMedias, 
    fetchSearchedMedias } from "../http/mediasApi.js";

const Movies = () => {
    const authToken = useContext(AuthTokenContext);
    const openFormLogin = useContext(LoginAuthFormContext);
    const [movieList, setMovieList] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const toggleBookMarkMedia = async (id, bool) => {
        let res;
        if (bool) {
            res = await addMarkMedia(id, authToken);
            console.log(res);
            if (!res.result) {
                alert(res.errorMessage);
                openFormLogin();
            }
        }
        else {
            res = await deleteMarkMedia(id, authToken);
            if (!res.result) {
                alert(res.errorMessage);
                openFormLogin();
            }
        }
        
        if (searchValue !== '') {
            setMoviesResult("searched", searchValue);
        }
        else {
            setMoviesResult();
        }
    }

    const setMoviesResult = async (type, searchValue) => {
        let medias;
        if (type !== "searched") {
            medias = await fetchMediasByType(1);
        }
        else {
            medias = await fetchSearchedMedias(searchValue, 1);
        }

        if (authToken) {
            let markMovies, markSeries;
            if (type !== "searched") {
                [markMovies, markSeries] = await fetchMarkedMedias(authToken);
            }
            else {
                [markMovies, markSeries] = await fetchSearchedMarkMedias(searchValue, authToken);
            }
            const markedMedias = [...markMovies];

            medias = medias.map(m => {
                if (markedMedias.some(mb => mb.id_media === m.id)) {
                    return { ...m, bookmarked: true };
                }
                else {
                    return { ...m, bookmarked: false };
                }
            });
        }

        setMovieList(medias);
    }

    useEffect(() => {
        if (searchValue !== '') {
            setMoviesResult('searched', searchValue);
        }
        else {
            setMoviesResult();
        }
    }, [authToken, searchValue]);

    return (
        <>
            <Panel 
                type="search" 
                placeholder="Search for movies" 
                onChangeHandler={(e) => setSearchValue(e.target.value)} 
            />
            {searchValue === ''
                ? <ListBlock type="trending" title="New Movies">
                    {movieList.map((m, index) => index <= 7
                        ? <Card type="trending"
                            bookmarked={m.bookmarked}
                            media={m}
                            key={m.id}
                            onToggleMark={() => toggleBookMarkMedia(m.id, !m.bookmarked)}
                        />
                        : null
                    )}
                  </ListBlock>
                : null
            }
            <ListBlock 
                title={searchValue === '' 
                    ? "Recommended for you" 
                    : `Found ${movieList.length} results for '${searchValue}'`}
            >
                {movieList.map(m =>
                    <Card bookmarked={m.bookmarked}
                        media={m}
                        key={m.id}
                        onToggleMark={() => toggleBookMarkMedia(m.id, !m.bookmarked)}
                    />
                )}
            </ListBlock>
        </>
    )
}

export default Movies;