import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const signUp = async (formData) => {
    try {
        const res = await axios.post(`${BASE_URL}/sign-up`, {
            screen_name: formData.screen_name,
            password: formData.password
        });

        const data = res.data;

        if (data.token) {
            localStorage.setItem('token', data.token);
            return JSON.parse(atob(data.token.split('.')[1])).payload;
        }

        throw new Error('No token received from server');
    } catch (err) {
        console.error('Sign up error:', err);
        if (err.res && err.res.data && err.res.data.err) {
            throw new Error(err.res.data.err);
        }
        throw new Error('Network error, please try again');
    }
};

const signIn = async (formData) => {
    try {
        const res = await axios.post(`${BASE_URL}/sign-in`, {
            screen_name: formData.screen_name,
            password: formData.password
        });

        const data = res.data;

        if (data.token) {
            localStorage.setItem('token', data.token);
            return JSON.parse(atob(data.token.split('.')[1])).payload;
        }

        throw new Error('No token received from server');
    } catch (err) {
        console.error('Sign in error:', err);
        if (err.res && err.res.data && err.res.data.err) {
            throw new Error(err.res.data.err);
        }
        throw new Error('Network error, please try again');
    }
};

export {
    signUp,
    signIn,
};