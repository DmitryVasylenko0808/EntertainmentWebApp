import { users } from "./index";

export const signUp = async (formData) => {
    const res = await users.post("auth/signup", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    const { errorMessage } = res.data;
    return errorMessage;
}

export const signIn = async (formData) => {
    const res = await users.post("auth/signin", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    const { token } = res.data;
    return token;
}

export const fetchAvatar = async (token) => {
    const res = await users.get("avatar", {
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    const { fileAvatarPath } = res.data;
    return fileAvatarPath;
}