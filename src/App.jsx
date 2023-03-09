import React, { useRef, useEffect} from 'react';
import './App.css';

// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// components
import SignInButton from './components/SignInButton';
import SignOutButton from './components/SignOutButton';
import ChatRoom from './components/ChatRoom';

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
	const textAreaRef = useRef(null);
	useEffect(() => {
		textAreaRef.current && textAreaRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [textAreaRef.current])

	const [user] = useAuthState(auth);
	const provider = new firebase.auth.GoogleAuthProvider();
	const messagesRef = firestore.collection('messages');
	const bannedUsersRef = firestore.collection('banned');
	const query = messagesRef.orderBy('createdAt').limit(25);
	const [messages] = useCollectionData(query, { idField: 'id' });

	const chatRoomProps = {
		messages,
		bannedUsersRef,
		messagesRef,
		currentUser: auth.currentUser,
		firebase,
		textAreaRef,
	};

	return (
		<>
			<nav className='navbar navbar-light bg-light justify-content-between sticky-top'>
				<div className='container-fluid'>
					<a href='#' className='navbar-brand'>
						MAD | Superchat App 💬
					</a>
					<a className='navbar-brand' href='#'>
						{user ? (
							<SignOutButton auth={auth} />
						) : (
							<SignInButton provider={provider} auth={auth} />
						)}
					</a>
				</div>
			</nav>
			<section className='mainContainer'>
				{user && <ChatRoom {...chatRoomProps} />}
			</section>
		</>
	);
};

export default App;