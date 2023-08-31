import React from "react"
import useAuth from "../auth/useAuth"
const Profile = () => {
	const { currentUser } = useAuth();
	return (
		<div>
			<h2>Welcome {currentUser.name}!</h2>
		</div>
	)
}

export default Profile
