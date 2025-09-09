import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { signIn } from '../../services/authService';
import { UserContext } from '../../contexts/UserContext';

const SignInForm = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [ loading, setLoading ] = useState(false);
    const [formData, setFormData] = useState({
        screen_name: '',
        password: '',
    });

    const handleChange = (e) => {
        setMessage('');
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            const signedInUser = await signIn(formData);
            setUser(signedInUser);
            navigate('/');
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.screen_name.trim() && formData.password.trim();
    };

    return (
        <main>
            <h1>Sign In</h1>
            {message && <p style={{ color: 'red' }}>{message}</p>}
            <form autoComplete='off' onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='screen_name'>Screen Name:</label>
                    <input
                        type='text'
                        autoComplete='off'
                        id='screen_name'
                        value={formData.screen_name}
                        name='screen_name'
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        autoComplete='off'
                        id='password'
                        value={formData.password}
                        name='password'
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <button
                        type='submit'
                        disabled={!isFormValid() || loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                    <button type='button' onClick={() => navigate('/')} disabled={loading}>Cancel</button>
                </div>
            </form>
        </main>
    );
};

export default SignInForm;

