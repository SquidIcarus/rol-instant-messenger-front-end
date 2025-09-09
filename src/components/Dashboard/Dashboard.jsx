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
    const [showBuddies, setShowBuddies] = useState(false);
    const [showAllUsers, setShowAllUsers] = useState(false);
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

            <h3>Send a Message Here!</h3>
            <form onSubmit={handleSendMessage}>
                <div>
                    <label>
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

            {selectedBuddy && (
                <div style={{ border: '1px solid #ffffffff', padding: '10px', maxHeight: '300px', overflowY: 'scroll' }}>
                    <h3>Messages with {selectedBuddy}</h3>
                    {loadingMessages ? (
                        <p>Loading messages...</p>
                    ) : messages.length === 0 ? (
                        <p>No messages yet. Send the first message!</p>
                    ) : (
                        <div>
                            {messages.map((msg) => (
                                <div key={msg._id} style={{ color: 'black', marginBottom: '10px', padding: '5px', backgroundColor: msg.sender_id.screen_name === user.screen_name ? '#e3f2fd' : '#f5f5f5' }}>
                                    <strong>{msg.sender_id.screen_name}:</strong> {msg.message_content}
                                    <br />
                                    <small>{new Date(msg.sent_at).toLocaleString()}</small>
                                </div>
                            ))}
                        </div>
                    )}
                    <button onClick={() => handleViewMessages(selectedBuddy)}>
                        Refresh Messages
                    </button>
                </div>
            )}

             <div className="w-60 border-2 border-gray-400 bg-gray-100 font-mono text-xs">
                <button 
                    onClick={() => setShowBuddies(!showBuddies)}
                    className="w-full bg-gray-300 border border-gray-500 px-2 py-1 text-xs font-bold text-left flex justify-between items-center hover:bg-gray-400"
                >
                    <span>Buddies ({buddies.length})</span>
                    <span className="text-xs">
                        {showBuddies ? '▲' : '▼'}
                    </span>
                </button>
                
                {showBuddies && (
                    <div className="max-h-36 overflow-y-auto bg-white border border-gray-300">
                        {buddies.length === 0 ? (
                            <p className="p-1 text-xs text-gray-500">No buddies online</p>
                        ) : (
                            <div>
                                {buddies.map((buddy) => (
                                    <div key={buddy._id} className="px-2 py-0.5 border-b border-gray-200 flex items-center text-xs hover:bg-blue-100">
                                        {buddy.friend_user_id ? (
                                            <>
                                                <span className="text-green-500 mr-1 text-xs">●</span>
                                                <span className="flex-1 truncate">{buddy.friend_user_id.screen_name}</span>
                                                <button 
                                                    onClick={() => handleViewMessages(buddy.friend_user_id.screen_name)}
                                                    className="ml-1 text-xs hover:bg-gray-200 px-1"
                                                >
                                                    💬
                                                </button>
                                                <button 
                                                    onClick={() => handleRemoveBuddy(buddy._id, buddy.friend_user_id.screen_name)}
                                                    className="ml-1 text-xs hover:bg-red-200 px-1"
                                                >
                                                    ×
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-gray-400 mr-1 text-xs">●</span>
                                                <span className="flex-1 text-gray-500 truncate">[Deleted User]</span>
                                                <button 
                                                    onClick={() => handleRemoveBuddy(buddy._id, 'Deleted User')}
                                                    className="ml-1 text-xs hover:bg-red-200 px-1"
                                                >
                                                    ×
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="mt-4"></div>

            <div className="w-60 border-2 border-gray-400 bg-gray-100 font-mono text-xs">
                <button 
                    onClick={() => setShowAllUsers(!showAllUsers)}
                    className="w-full bg-gray-300 border border-gray-500 px-2 py-1 text-xs font-bold text-left flex justify-between items-center hover:bg-gray-400"
                >
                    <span>All Users ({allUsers.length})</span>
                    <span className="text-xs">
                        {showAllUsers ? '▲' : '▼'}
                    </span>
                </button>
                
                {showAllUsers && (
                    <div className="max-h-48 overflow-y-auto bg-white border border-gray-300">
                        {allUsers.length === 0 ? (
                            <p className="p-1 text-xs text-gray-500">No other users</p>
                        ) : (
                            <div>
                                {allUsers.map((otherUser) => (
                                    <div key={otherUser._id} className="px-2 py-0.5 border-b border-gray-200 flex items-center text-xs hover:bg-blue-100">
                                        <span className="text-blue-500 mr-1 text-xs">●</span>
                                        <span className="flex-1 truncate">{otherUser.screen_name}</span>
                                        {isBuddy(otherUser.screen_name) ? (
                                            <span className="text-green-600 text-xs">😎</span>
                                        ) : (
                                            <button 
                                                onClick={() => handleAddBuddy(otherUser.screen_name)}
                                                className="ml-1 text-xs hover:bg-green-200 px-1 font-bold"
                                            >
                                                +
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Dashboard;