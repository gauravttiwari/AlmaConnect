import React, { useState, useEffect, useRef } from 'react';
import socket from '../utils/socket';

const contacts = [
	{ id: 'student1', name: 'Student 1' },
	{ id: 'alumni1', name: 'Alumni 1' },
];

const Chat = () => {
	const [selectedContact, setSelectedContact] = useState(contacts[0]);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [notification, setNotification] = useState('');
	const messagesEndRef = useRef(null);

	useEffect(() => {
		// Fetch chat history from REST API
		fetch(`/api/messages/${selectedContact.id}`)
			.then(res => res.json())
			.then(data => setMessages(data));
	}, [selectedContact]);

	useEffect(() => {
		socket.on('receiveMessage', (msg) => {
			setMessages(prev => [...prev, msg]);
			setNotification(`New message from ${msg.senderName}`);
			setTimeout(() => setNotification(''), 3000);
		});
		return () => {
			socket.off('receiveMessage');
		};
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const sendMessage = () => {
		if (!input.trim()) return;
		const msg = {
			sender: 'me',
			senderName: 'You',
			receiver: selectedContact.id,
			receiverModel: 'Student',
			content: input,
		};
		socket.emit('sendMessage', msg);
		setMessages(prev => [...prev, msg]);
		setInput('');
	};

	return (
		<div className="main-container">
			<h2>Direct Chat</h2>
			{notification && (
				<div style={{ background: '#1976d2', color: '#fff', padding: 8, borderRadius: 8, marginBottom: 12 }}>
					{notification}
				</div>
			)}
			<div style={{ display: 'flex', height: 400, border: '1px solid #b0bec5', borderRadius: 12, overflow: 'hidden' }}>
				<div style={{ width: 220, background: '#f5f7fa', borderRight: '1px solid #b0bec5', padding: 16 }}>
					<h4 style={{ marginTop: 0 }}>Contacts</h4>
					{contacts.map(contact => (
						<div
							key={contact.id}
							style={{ marginBottom: 12, cursor: 'pointer', color: selectedContact.id === contact.id ? '#1565c0' : '#1976d2', fontWeight: selectedContact.id === contact.id ? 700 : 400 }}
							onClick={() => setSelectedContact(contact)}
						>
							{contact.name}
						</div>
					))}
				</div>
				<div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: '#fff' }}>
					<div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
						{messages.map((msg, i) => (
							<div key={i} style={{ marginBottom: 12, textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
								<span style={{ background: msg.sender === 'me' ? '#1976d2' : '#e3f2fd', color: msg.sender === 'me' ? '#fff' : '#1976d2', borderRadius: 16, padding: '8px 18px', display: 'inline-block' }}>
									{msg.content}
								</span>
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
					<div style={{ padding: 16, borderTop: '1px solid #b0bec5', background: '#f5f7fa' }}>
						<input
							placeholder="Type your message..."
							style={{ width: '80%', marginRight: 8 }}
							value={input}
							onChange={e => setInput(e.target.value)}
							onKeyDown={e => e.key === 'Enter' && sendMessage()}
						/>
						<button className="btn-primary" onClick={sendMessage}>Send</button>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Chat;
