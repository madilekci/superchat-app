import React from 'react'
import moment from 'moment';

const ChatMessage = ({ message, currentUser }) => {
	const { text, uid, photoURL } = message;
	const timeDiff = message.createdAt?.seconds
		? moment.unix(message.createdAt.seconds).fromNow()
		: '';

	const messageDirection = uid === currentUser?.uid ? 'sent' : 'received';

	const avatarClass = messageDirection === 'sent' ? 'ms-3' : 'me-3';

	return (
		<li className={`d-flex justify-content-between mb-4 ${messageDirection === 'sent' && ' flex-row-reverse'}`}>
			<img
				src={photoURL}
				onError={(event) => {
					event.target.src = 'anonymous-avatar.png';
				}}
				alt='avatar'
				className={`rounded-circle d-flex align-self-start shadow-1-strong ${avatarClass}`}
				width='60'
			/>

			<div className='card w-100'>
				<div className={`card-header d-flex justify-content-between ${messageDirection === 'sent' && ' flex-row-reverse'}`}>
					<p className='fw-light fs-6 mb-0'>{currentUser.displayName}</p>
					<p className='mb-0' style={{fontSize: '0.8rem'}}>
						{timeDiff}
					</p>
				</div>
				<div className='card-body'>
					<p className='mb-0'>{text}</p>
				</div>
			</div>
		</li>
	);
};

export default ChatMessage