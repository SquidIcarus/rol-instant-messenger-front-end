import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signUp } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignUpForm = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
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

        if (password !== passwordConf) {
            setMessage('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long.');
            return;
        }

        if (screen_name.length < 3) {
            setMessage('Screen name must be at least 3 characters long.');
            return;
        }

        setLoading(true);

        try {
            const newUser = await signUp(formData);
            setUser(newUser);
            navigate('/');
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isFormInvalid = () => {
        return !(screen_name && password && password === passwordConf);
    };

    return (
        <main>
            <h1>Sign Up</h1>
            {message && <p style={{ color: 'red' }}>{message}</p>}
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
                        disabled={loading}
                        minLength='3'
                    />
                    <small>At least 3 characters</small>
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
                        disabled={loading}
                        minLength='6'
                    />
                    <small>At least 6 characters</small>
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
                        disabled={loading}
                    />
                    {password && passwordConf && password !== passwordConf && (
                        <small style={{color: 'red' }}>Passwords do not match</small>
                    )}
                </div>
                <div>
                    <button disabled={isFormInvalid() || loading} type='submit'>{loading ? 'Signing Up...' : 'Sign Up'}</button>
                    <button type='button' onClick={() => navigate('/')} disabled={loading}>Cancel</button>
                </div>
            </form>
        </main>
    );
};

export default SignUpForm;
