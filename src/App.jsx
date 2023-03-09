import React, { useState } from 'react';
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

import moment from 'moment';

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
  const provider = new firebase.auth.GoogleAuthProvider();

	return (
		<>
      {/* Navbar */}
			<nav className='navbar navbar-light bg-light justify-content-between sticky-top'>
      <div className="container-fluid">
        <a href="#" className='navbar-brand'>MAD | Superchat APP 💬</a>
        <a className='navbar-brand' href='#'>
					{ user ?  <SignOutButton auth={auth} /> : <SignInButton provider={provider} auth={auth} />  }
        </a>
        </div>
			</nav>
      { user && <ChatRoom /> }
		</>
	);
};

const ChatRoom = () => {
	const messagesRef = firestore.collection('messages');
	const query = messagesRef.orderBy('createdAt').limit(25);
	const [formValue, setFormValue] = useState('');

	const [messages] = useCollectionData(query, { idField: 'id' });

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
    <section style={{backgroundColor: '#E5E5CB'}}>
        <div style={{minHeight: '600px'}} className='container py-5'>
          <div className="row">
            <div className="col-md-4 col-lg-8 offset-2">
              <ul className="list-unstyled">
                {
                  messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
                }
                <li className="bg-white mb-3 mt-5">
                  <form className="form-floating form-outline" onSubmit={sendMessage}>
                    <textarea
                      className="form-control"
                      placeholder="Type your message here"
                      id="floatingTextarea2"
                      value={formValue}
                      onChange={(e) => setFormValue(e.target.value)}
                    />
                    <label htmlFor="floatingTextarea2">Your message</label>
                    <button className='btn btn-lg btn-outline-success float-end mt-3' type='submit'>Send 🕊</button>
                  </form>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </section>
	);
};

const ChatMessage = ({ message }) => {
	const { text, uid, photoURL } = message;
  const timeDiff = message.createdAt?.seconds ? moment.unix(message.createdAt.seconds).fromNow() : ''

	const messageDirection = uid === auth.currentUser?.uid ? 'sent' : 'received';
  const user = auth.currentUser;

  let messageLiClass = 'd-flex justify-content-between mb-4';
  messageDirection === 'sent' && (messageLiClass += ' flex-row-reverse');

  const avatarClass = messageDirection === 'sent' ? 'ms-3' : 'me-3';

	return (
    <li className={messageLiClass}>
      <img src={photoURL} alt="avatar"
        className={`rounded-circle d-flex align-self-start shadow-1-strong ${avatarClass}`} width="60" />

      <div className="card w-100 ml-2">
        <div className="card-header d-flex justify-content-between p-3">
          <p className="fw-bold mb-0">{user.displayName}</p>
          <p className="text-muted small mb-0"><i className="far fa-clock"></i>{timeDiff}</p>
        </div>
        <div className="card-body">
          <p className="mb-0">
            {text}
          </p>
        </div>
      </div>
    </li>
	);
};

export default App;
