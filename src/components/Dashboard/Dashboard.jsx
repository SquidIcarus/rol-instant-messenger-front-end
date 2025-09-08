import { useEffect, useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

import * as userService from '../../services/userService';

const Dashboard = () => {
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await userService.getBuddies();
                console.log(fetchedUsers);
            } catch (err) {
                console.log(err)
            }
        }
        if (user) fetchUsers();
    }, [user]);

    return (
        <main>
            <h1>Welcome, {user.screen_name}</h1>
            <p>
                Find your buddies amidst all the users!
            </p>
        </main>
    );
};

export default Dashboard;