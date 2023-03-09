import React from 'react'
import './App.css'

import firebase from 'firebase/compat/app';

import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyDm9rZqLiWXXke3bFsmVF_Sk4FABUW-nFE",
  authDomain: "superchat-mad-1.firebaseapp.com",
  projectId: "superchat-mad-1",
  storageBucket: "superchat-mad-1.appspot.com",
  messagingSenderId: "907684402565",
  appId: "1:907684402565:web:c9ca03da81758dfa4ba0ec",
  measurementId: "G-TYVH3DCFY7"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  console.log(user);

  return (
    <div className='App'>
      <header>Hello {user?.displayName}</header>

      <section>
        { user ? <SignOutButton /> : <SignIn />}
      </section>
    </div>
  )
}


const SignIn = () => {
  const handleSignIn = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return <button onClick={handleSignIn} >Sign In with Google</button>
}

const SignOutButton = () => <button onClick={() => auth.signOut()} >Sign Out</button>

export default App
