import React, { useContext, useState, useEffect } from "react";
import axios from "axios";

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

const TvSeries = () => {
    const authToken = useContext(AuthTokenContext);
    const openFormLogin = useContext(LoginAuthFormContext);
    const [seriesList, setSeriesList] = useState([]);
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
            setSeriesResult("searched", searchValue);
        }
        else {
            setSeriesResult();
        }
    }

    const setSeriesResult = async (type, searchValue) => {
        let medias;
        if (type !== "searched") {
            medias = await fetchMediasByType(2);
        }
        else {
            medias = await fetchSearchedMedias(searchValue, 2);
        }

        if (authToken) {
            let markMovies, markSeries;
            if (type !== "searched") {
                [markMovies, markSeries] = await fetchMarkedMedias(authToken);
            }
            else {
                [markMovies, markSeries] = await fetchSearchedMarkMedias(searchValue, authToken);
            }
            const markedMedias = [...markSeries];

            medias = medias.map(m => {
                if (markedMedias.some(mb => mb.id_media === m.id)) {
                    return { ...m, bookmarked: true };
                }
                else {
                    return { ...m, bookmarked: false };
                }
            });
        }

        setSeriesList(medias);
    }

    useEffect(() => {
        if (searchValue !== '') {
            setSeriesResult('searched', searchValue);
        }
        else {
            setSeriesResult();
        }
    }, [authToken, searchValue]);

    return (
        <>
            <Panel
                type="search"
                placeholder="Search for TV series"
                onChangeHandler={(e) => setSearchValue(e.target.value)}
            />
            {searchValue === ''
                ? <ListBlock type="trending" title="New TV Series">
                    {seriesList.map((m, index) => index <= 7
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
                    : `Found ${seriesList.length} results for '${searchValue}'`}
            >
                {seriesList.map(m =>
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

export default TvSeries;