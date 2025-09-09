import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

const getToken = () => {
    return localStorage.getItem('token');
};

const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// GET ALL USERS
export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${BASE_URL}/users`, {
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

// GET BUDDY LIST

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

// ADD BUDDY

export const addBuddy = async (friend_screen_name) => {
    try {
        const res = await axios.post(`${BASE_URL}/buddies`,
            { friend_screen_name },
            { headers: getAuthHeaders() }
        );
        return res.data;
    } catch (err) {
        if (err.response && err.response.data) {
            throw new Error(err.response.data.err);
        }
        throw new Error('Network error, please try again');
    }
};

// REMOVE BUDDY

export const removeBuddy = async (buddyId) => {
    try {
        const res = await axios.delete(`${BASE_URL}/buddies/${buddyId}`, {
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


