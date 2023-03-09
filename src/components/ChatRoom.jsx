import React, { useState } from 'react';
import Filter from 'bad-words';

// components
import ChatMessage from './ChatMessage';

const ChatRoom = ({ messages, bannedUsersRef, messagesRef, currentUser, firebase, textAreaRef }) => {
	const [formValue, setFormValue] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

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
							<form
								className='form-floating'
								onSubmit={handleSubmit}
							>
								<textarea
									ref={textAreaRef}
									className='form-control'
									placeholder='Type your message here'
									id='textarea'
									value={formValue}
									onChange={(e) => setFormValue(e.target.value)}
								/>
								<label htmlFor='textarea'>Your message</label>
								<button
									className='btn btn-lg btn-success float-end mt-3'
									type='submit'
								>
									Send 🕊
								</button>
							</form>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default ChatRoom;
