import React, { useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';

import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
	apiKey: 'AIzaSyDm9rZqLiWXXke3bFsmVF_Sk4FABUW-nFE',
	authDomain: 'superchat-mad-1.firebaseapp.com',
	projectId: 'superchat-mad-1',
	storageBucket: 'superchat-mad-1.appspot.com',
	messagingSenderId: '907684402565',
	appId: '1:907684402565:web:c9ca03da81758dfa4ba0ec',
	measurementId: 'G-TYVH3DCFY7',
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
	const [user] = useAuthState(auth);

	return (
		<div className='App'>
      <div>
        <button className='btn btn-info'>Hey</button>
      </div>
      {
        user ? (
          <>
            <section className='authentication'>
              <SignOutButton />
              <SignIn/>
            </section>
            <section className='header'>
              <h1>MAD | Superchat APP ⚛️🔥💬</h1>
            </section>
            <ChatRoom />
          </>
        ) : (
          <SignIn/>
        )
      }

		</div>
	);
};

const SignIn = () => {
	const handleSignIn = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};

	return <button onClick={handleSignIn}>Sign In with Google</button>;
};
const SignOutButton = () => <button onClick={() => auth.signOut()}>Sign Out</button>;

const ChatRoom = () => {
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(25);
	const [formValue, setFormValue] = useState('');

	const [messages] = useCollectionData(query, { idField: 'id' });
	console.log('messages', messages);

	const sendMessage = async (e) => {
		e.preventDefault();
		const { uid, photoURL } = auth.currentUser;

		await messagesRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid,
			photoURL,
		});

		setFormValue('');
	};

	return (
		<>
			<div>
				{messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
			</div>
			<form onSubmit={sendMessage}>
				<input
					value={formValue}
					onChange={(e) => setFormValue(e.target.value)}
					type='text'
				/>
				<button type='submit'>🕊</button>
			</form>
		</>
	);
};

const ChatMessage = ({ message }) => {
	const { text, uid, photoURL } = message;

	const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
	return (
		<div className={messageClass} style={{display:'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
			<img width={'24px'} height={'24px'} src={photoURL} alt='' />
			<p>{message.text}</p>
		</div>
	);
};

export default App;
