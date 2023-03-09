import React, { useRef, useEffect} from 'react';
import './App.css';

// firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { useAuthState } from 'react-firebase-hooks/auth';


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

const App = () => {
	const auth = firebase.auth();
	const provider = new firebase.auth.GoogleAuthProvider();

	// scroll into message area when page is loaded
	const textAreaRef = useRef(null);
	useEffect(() => {
		textAreaRef.current && textAreaRef.current.scrollIntoView({ behavior: 'smooth' });
	}, [textAreaRef.current]);

	// get user if user is authenticated
	const [user] = useAuthState(auth);

	const chatRoomProps = {
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