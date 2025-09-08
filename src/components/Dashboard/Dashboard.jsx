import { useState, useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as userService from '../../services/userService';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [buddies, setBuddies] = useState([]);

    useEffect(() => {
        const fetchBuddies = async () => {
            try {
                const fetchedBuddies = await userService.getBuddies();
                console.log('My buddies:', fetchedBuddies);
                setBuddies(fetchedBuddies);
            } catch (err) {
                console.log(err);
            }
        }
        
        if (user) fetchBuddies();
    }, [user]);

    return (
        <main>
            <h1>Welcome, {user.screen_name}</h1>
            <p>Find your buddies amidst all the users!</p>
            
            <h2>Your Buddies</h2>
            {buddies.length === 0 ? (
                <p>No buddies yet.</p>
            ) : (
                <ul>
                    {buddies.map((buddy) => (
                        <li key={buddy._id}>
                            {buddy.friend_user_id.screen_name}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default Dashboard;