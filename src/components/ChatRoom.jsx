import React, { useState } from 'react';
import Filter from 'bad-words';

// firebase
import { useCollectionData } from 'react-firebase-hooks/firestore';

// components
import ChatMessage from './ChatMessage';

const ChatRoom = ({ currentUser, firebase, textAreaRef }) => {
	const [formValue, setFormValue] = useState('');
	const firestore = firebase.firestore();

	// get last 25 messages with query
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(25);
	let [messages] = useCollectionData(query, { idField: 'id' });


	const bannedUsersRef = firestore.collection('banned');

	const handleClick = async () => {
		const { uid, photoURL } = currentUser;

		// check if message is appropriate
		const filter = new Filter();
		const isProfane = filter.isProfane(formValue);

		// if message is not appropriate
		// create an empty doc under banned collection
		isProfane && await bannedUsersRef.doc(uid).set({});


		await messagesRef.add({
			text: isProfane ? `🤐 I got banned for saying: ${filter.clean(formValue)}` : formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid,
			photoURL,
		});

		setFormValue('');
	};

	return (
		<div className='container py-5'>
			<div className='row'>
				<div className='col-md-12 col-lg-8 offset-lg-2'>
					<ul className='list-unstyled'>
						{messages &&
							messages.map((msg) => <ChatMessage key={msg.id} message={msg} currentUser={currentUser} />)}
						<li className='bg-white mb-3 mt-5'>
							<textarea
								ref={textAreaRef}
								className='form-control'
								placeholder='Type your message here'
								id='textarea'
								value={formValue}
								rows="5"
								onChange={(e) => setFormValue(e.target.value)}
							/>
							<button
								className='btn btn-lg btn-success float-end mt-3'
								type='button'
								onClick={handleClick}
							>
								Send 🕊
							</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default ChatRoom;
