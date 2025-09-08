import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const getToken = () => {
    return localStorage.getItem('token');
};

const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getBuddies = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/buddies`, {
            headers: getAuthHeaders()
        });
        return res.data;
    } catch (err) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.err);
        }
        throw new Error('Network error, please try again');
    }
};


