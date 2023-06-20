import axios from "axios";

const host = "http://localhost:3000/";

export const meds = axios.create({
    baseURL: host + "medias/"
});

export const users = axios.create({
    baseURL: host
});