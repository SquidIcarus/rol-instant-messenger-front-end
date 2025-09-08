import { useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';

const Dashboard = () => {
    const { user } = useContext(UserContext);

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