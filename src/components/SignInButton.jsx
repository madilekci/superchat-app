import React from 'react'

const SignInButton = ({ provider, auth }) => {
  const handleSignIn = () => {
		auth.signInWithPopup(provider);
	};

	return <button className='btn btn-outline-success my-2 my-sm-0' onClick={handleSignIn}>Sign In with Google</button>;
}

export default SignInButton