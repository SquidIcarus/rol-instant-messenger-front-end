import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as userService from '../../services/userService';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [buddies, setBuddies] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBuddies = async () => {
            try {
                const fetchedBuddies = await userService.getBuddies();
                console.log('My buddies:', fetchedBuddies);
                setBuddies(fetchedBuddies);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        }

        if (user) fetchBuddies();
    }, [user]);

    const handleRemoveBuddy = async (buddyId, buddyName) => {
        if (!window.confirm(`Are you sure you want to remove ${buddyName} from your buddies list?`)) {
            return;
        }

        setError('');
        setMessage('');

        try {
            const result = await userService.removeBuddy(buddyId);
            setMessage(result.message);

            const updatedBuddies = await userService.getBuddies();
            setBuddies(updatedBuddies);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <main>
            <h1>Welcome, {user.screen_name}</h1>
            <p>Find your buddies here!</p>

            {message && <p>{message}</p>}
            {error && <p>Error: {error}</p>}

            <h2>Your Buddies</h2>
            {buddies.length === 0 ? (
                <p>No buddies yet.</p>
            ) : (
                <ul>
                    {buddies.map((buddy) => (
                        <li key={buddy._id}>
                            {buddy.friend_user_id.screen_name}
                            {' '}
                            <button onClick={() => handleRemoveBuddy(buddy._id, buddy.friend_user_id.screen_name)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default Dashboard;