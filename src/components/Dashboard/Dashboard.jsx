import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as userService from '../../services/userService';
import * as messageService from '../../services/messageService';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [buddies, setBuddies] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [messageForm, setMessageForm] = useState({
        recipient: '',
        content: ''
    });
    const [selectedBuddy, setSelectedBuddy] = useState('');
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);

    useEffect(() => {
        const fetchBuddies = async () => {
            try {
                const fetchedBuddies = await userService.getBuddies();
                console.log('My buddies:', fetchedBuddies);
                setBuddies(fetchedBuddies);

                const fetchedUsers = await userService.getAllUsers();
                console.log('All users:', fetchedUsers);
                setAllUsers(fetchedUsers);
            } catch (err) {
                console.log(err);
                setError(err.message);
            }
        }

        if (user) fetchBuddies();
    }, [user]);

    const isBuddy = (userScreenName) => {
        return buddies.some(buddy =>
            buddy.friend_user_id &&
            buddy.friend_user_id.screen_name === userScreenName
        );
    };

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

    const handleAddBuddy = async (userScreenName) => {
        setError('');
        setMessage('');
        try {
            const result = await userService.addBuddy(userScreenName);
            setMessage(result.message);

            const updatedBuddies = await userService.getBuddies();
            setBuddies(updatedBuddies);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMessageChange = (e) => {
        setMessageForm({
            ...messageForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const result = await messageService.sendMessage(
                messageForm.recipient,
                messageForm.content
            );
            setMessage(`Message sent to ${messageForm.recipient}!`);
            setMessageForm({
                recipient: '',
                content: ''
            });

            if (selectedBuddy === messageForm.recipient) {
                handleViewMessages(messageForm.recipient);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleViewMessages = async (buddyScreenName) => {
        setError('');
        setLoadingMessages(true);
        setSelectedBuddy(buddyScreenName);

        try {
            const fetchedMessages = await messageService.getMessages(buddyScreenName);
            setMessages(fetchedMessages);
            console.log(`Found ${fetchedMessages.length} messages with ${buddyScreenName}`);
        } catch (err) {
            setError(err.message);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    return (
        <main>
            <h1>Welcome, {user.screen_name}</h1>
            <p>Find your buddies here!</p>

            {message && <p>{message}</p>}
            {error && <p>Error: {error}</p>}

            <h2>Send a Message</h2>
            <form onSubmit={handleSendMessage}>
                <div>
                    <label>
                        To (screen Name):
                        <input
                            type='text'
                            name='recipient'
                            value={messageForm.recipient}
                            onChange={handleMessageChange}
                            placeholder="Enter buddy's screen name"
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Message:
                        <textarea
                            name="content"
                            value={messageForm.content}
                            onChange={handleMessageChange}
                            placeholder='Type your message...'
                            rows="3"
                            required
                        />
                    </label>
                </div>
                <button type='submit'>Send Message</button>
            </form>

            <h2>Your Buddies</h2>
            {buddies.length === 0 ? (
                <p>No buddies yet.</p>
            ) : (
                <ul>
                    {buddies.map((buddy) => (
                        <li key={buddy._id}>
                            {buddy.friend_user_id.screen_name}
                            {' '}
                            <button onClick={() => handleViewMessages(buddy.friend_user_id.screen_name)}>
                                ✉️
                            </button>
                            {' '}
                            <button onClick={() => handleRemoveBuddy(buddy._id, buddy.friend_user_id.screen_name)}>
                                🗑️
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {selectedBuddy && (
                <div>
                    <h3>Messages with {selectedBuddy}</h3>
                    {loadingMessages ? (
                        <p>Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p>No messages yet. Send the first message!</p>
                    ) : (
                        <div style={{ border: '1px solid #ffffffff', padding: '10px', maxHeight: '300px', overflowY: 'scroll' }}>
                            {messages.map((msg) => (
                                <div key={msg._id} style={{ color: 'black', marginBottom: '10px', padding: '5px', backgroundColor: msg.sender_id.screen_name === user.screen_name ? '#e3f2fd' : '#f5f5f5' }}>
                                    <strong>{msg.sender_id.screen_name}:</strong> {msg.message_content}
                                    <br />
                                    <small>{new Date(msg.sent_at).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => handleViewMessages(selectedBuddy)} style={{ marginTop: '10px' }}>
                        Refresh Messages
                    </button>
                </div>
            )}

            <h2>All Registered Users</h2>
            {allUsers.length === 0 ? (
                <p>No other users yet.</p>
            ) : (
                <ul>
                    {allUsers.map((otherUser) => (
                        <li key={otherUser._id}>
                            {otherUser.screen_name}
                            {' '}
                            {isBuddy(otherUser.screen_name) ? (
                                <span>(😎)</span>
                            ) : (
                                <button onClick={() => handleAddBuddy(otherUser.screen_name)}>
                                    Add Buddy
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
};

export default Dashboard;