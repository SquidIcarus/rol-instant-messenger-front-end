import { useState } from 'react';
import { useNavigate } from 'react-router';

const SignUpForm = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        screen_name: '',
        password: '',
        passwordConf: '',
    });

    const { screen_name, password, passwordConf } = formData;

    const handleChange = (e) => {
        setMessage('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted!');
        console.log(formData);
    };

    const isFormInvalid = () => {
        return !(screen_name && password && password === passwordConf);
    };

    return (
        <main>
            <h1>Sign Up</h1>
            <p>{message}</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='screen_name'>Screen Name:</label>
                    <input
                        type='text'
                        id='screen_name'
                        value={screen_name}
                        name='screen_name'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        name='password'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor='confirm'>Confirm Password:</label>
                    <input
                        type='password'
                        id='confirm'
                        value={passwordConf}
                        name='passwordConf'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <button disabled={isFormInvalid()}>Sign Up</button>
                    <button onClick={() => navigate('/')}>Cancel</button>
                </div>
            </form>
        </main>
    );
};

export default SignUpForm;
