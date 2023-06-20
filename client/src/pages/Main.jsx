import React, { useContext, useEffect, useState } from "react";

import Panel from "../components/Panel.jsx";
import ListBlock from "../components/ListBlock.jsx";
import Card from "../components/Card.jsx";

import { AuthTokenContext, LoginAuthFormContext } from "../contexts/AuthTokenContext.js";
import { addMarkMedia, 
    deleteMarkMedia, 
    fetchAllMedias, 
    fetchMarkedMedias, 
    fetchSearchedMarkMedias, 
    fetchSearchedMedias } from "../http/mediasApi.js";

const Main = ({ background }) => {
    const authToken = useContext(AuthTokenContext);
    const openFormLogin = useContext(LoginAuthFormContext);

    const [mediaList, setMediaList] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const setMediasResult = async (type, searchValue) => {
        let medias;
        if (type !== "searched") {
            medias = await fetchAllMedias();
        }
        else {
            medias = await fetchSearchedMedias(searchValue);
        }

        if (authToken) {
            let markMovies, markSeries;
            if (type !== "searched") {
                [markMovies, markSeries] = await fetchMarkedMedias(authToken);
            }
            else {
                [markMovies, markSeries] = await fetchSearchedMarkMedias(searchValue, authToken);
            }
            const markedMedias = [...markMovies, ...markSeries];

            medias = medias.map(m => {
                if (markedMedias.some(mb => mb.id_media === m.id)) {
                    return { ...m, bookmarked: true };
                }
                else {
                    return { ...m, bookmarked: false };
                }
            });
        }

        setMediaList(medias);
    }

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
            setMediasResult("searched", searchValue);
        }
        else {
            setMediasResult();
        }
    }

    useEffect(() => {
        if (searchValue !== '') {
            setMediasResult("searched", searchValue);
        }
        else {
            setMediasResult();
        }
    }, [authToken, searchValue]);

    return (
        <>
            <Panel
                type="search"
                placeholder="Search for movies or TV series"
                onChangeHandler={(e) => setSearchValue(e.target.value)}
            />
            {searchValue === ''
                ? <ListBlock type="trending" title="New medias">
                    {mediaList.map((m, index) => index <= 7
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
                    : `Found ${mediaList.length} results for '${searchValue}'`}
            >
                {mediaList.map(m =>
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

export default Main;