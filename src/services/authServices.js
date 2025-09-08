import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const signUp = async (formData) => {
    try {
        const response = await axios.post(`${BASE_URL}/sign-up`, {
            screen_name: formData.screen_name,
            password: formData.password
        });

        const data = response.data;

        if (data.token) {
            localStorage.setItem('token', data.token);
            return JSON.parse(atob(data.token.split('.')[1])).payload;
        }

        throw new Error('No token received from server');
    } catch (err) {
        console.error('Sign up error:', err);
        if (err.response && err.response.data && err.response.data.err) {
            throw new Error(err.response.data.err);
        }
        throw new Error('Netword error - please try again');
    }
};

export {
    signUp,
};