import React from 'react';

const SignOutButton = ({ auth }) => (
	<button className='btn btn-outline-success my-2 my-sm-0' onClick={() => auth.signOut()}>
		Sign Out
	</button>
);

export default SignOutButton;
