import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import Panel from "../components/Panel.jsx";
import ListBlock from "../components/ListBlock.jsx";
import Card from "../components/Card.jsx";

import {
    AuthTokenContext,
    LoginAuthFormContext
} from "../contexts/AuthTokenContext";
import { useNavigate } from "react-router";
import { deleteMarkMedia, 
    fetchMarkedMedias, 
    fetchSearchedMarkMedias } from "../http/mediasApi.js";

const BookMarked = () => {
    const authToken = useContext(AuthTokenContext);
    const openFormLogin = useContext(LoginAuthFormContext);
    const [bookMarkedList, setBookMarkedList] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const deleteBookMarkMedia = async (id) => {
        await deleteMarkMedia(id, authToken);
        if (searchValue !== '') {
            setBookMarkedResult("searched", searchValue);
        }
        else {
            setBookMarkedResult();
        }
    }

    const setBookMarkedResult = async (type, searchValue) => {
        const [markMovies, markSeries] = await fetchMarkedMedias(authToken);
        let medias = [...markMovies, ...markSeries];

        if (type === 'searched') {
            const [searchMarkMovies, searchMarkSeries] = await fetchSearchedMarkMedias(searchValue, authToken);
            const markedMedias = [...searchMarkMovies, ...searchMarkSeries];

            console.log(markedMedias);

            medias = medias.filter(m => {
                if (markedMedias.some(mb => mb.id_media === m.id_media)) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }

        setBookMarkedList(medias);
    }

    useEffect(() => {
        if (authToken) {
            if (searchValue !== '') {
                setBookMarkedResult('searched', searchValue);
            }
            else {
                setBookMarkedResult();
            }
        }
        else {
            navigate("/");
            openFormLogin();
        }
    }, [authToken, searchValue]);

    return (
        <>
            <Panel
                type="search"
                placeholder="Search for bookmarked movies or TV series"
                onChangeHandler={(e) => setSearchValue(e.target.value)}
            />
            {bookMarkedList.filter(m => m.type === 'Movies').length !== 0 && searchValue === ''
                ? <ListBlock title="Bookmarked movies">
                    {bookMarkedList
                        .filter(m => m.type === 'Movies')
                        .map(m =>
                            <Card
                                bookmarked
                                media={m}
                                key={m.id_media}
                                onToggleMark={() => deleteBookMarkMedia(m.id_media)}
                            />
                        )
                    }
                </ListBlock>
                : null
            }
            {bookMarkedList.filter(m => m.type === 'TV Series').length !== 0 && searchValue === ''
                ? <ListBlock title="Bookmarked TV series">
                    {bookMarkedList
                        .filter(m => m.type === 'TV Series')
                        .map(m =>
                            <Card
                                bookmarked
                                media={m}
                                key={m.id_media}
                                onToggleMark={() => deleteBookMarkMedia(m.id_media)}
                            />
                        )
                    }
                </ListBlock>
                : null
            }
            {searchValue !== ''
                ? <ListBlock
                    title={`Found ${bookMarkedList.length} results for '${searchValue}'`}
                >
                    {bookMarkedList.map(m =>
                        <Card 
                            bookmarked
                            media={m}
                            key={m.id}
                            onToggleMark={() => deleteBookMarkMedia(m.id_media)}
                        />
                    )}
                </ListBlock>
                : null
            }
        </>
    )
}

export default BookMarked;