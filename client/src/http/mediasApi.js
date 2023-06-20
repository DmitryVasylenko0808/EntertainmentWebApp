import { meds } from "./index";

export const fetchAllMedias = async () => {
    try {
        const res = await meds.get();
        const { medias } = res.data;
        return medias;
    }
    catch (error) {
        const { errorMessage } = error.response.data;
        return [];
    }
}

export const fetchMediasByType = async (typeId) => {
    try {
        const res = await meds.get(`type/${typeId}`);
        const { medias } = res.data;
        return medias;
    }
    catch (error) {
        const { errorMessage } = error.response.data;
        return [];
    }
}

export const fetchMarkedMedias = async (token) => {
    try {
        const res = await meds.get("marks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const { markMovies, markSeries } = res.data;
        return [markMovies, markSeries];
    }
    catch (error) {
        const { errorMessage } = error.response.data;
        return [[], []];
    }
}

export const fetchSearchedMedias = async (title, type = "all") => {
    try {
        const res = await meds.get(`search/type/${type}/title/${title}`);
        const { medias } = res.data;
        return medias;
    }
    catch (error) {
        const { errorMessage } = error.response.data;
        return [];
    }
}

export const fetchSearchedMarkMedias = async (title, token) => {
    try {
        const res = await meds.get(`search/marked/title/${title}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const { markMovies, markSeries } = res.data;
        return [markMovies, markSeries];
    }
    catch (error) {
        const { errorMessage } = error.response.data;
        return [[], []];
    }
}

export const addMarkMedia = async (id, token) => {
    try {
        const res = await meds.post(`marks/add`,
            { mediaId: id },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        const { message } = res.data;
        return { result: true, message};
    }
    catch (error) {
        const { errorMessage } = error.response.data;
        return { result: false, errorMessage};
    }
}

export const deleteMarkMedia = async (id, token) => {
    try {
        const res = await meds.delete(`marks/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const { message } = res.data;
        return { result: true, message};
    }
    catch (error) {
        const { errorMessage } = error.response.data;
        return { result: false, errorMessage};
    }
}