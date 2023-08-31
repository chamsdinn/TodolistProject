import { NavLink } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import "../../styles/NavMain.css";

const NavMain = () => {
	const { isLoggedIn, currentUser, removeUser } = useAuth();
	return (
		<nav className="NavMain">
			<NavLink className="logo" to="/">
				Todo
			</NavLink>
			{isLoggedIn && (
				<>
					<NavLink to="/profile">{currentUser && currentUser.email}</NavLink>
					<button onClick={removeUser}>Log-Out</button>
					<NavLink to="/todolist">Todo List</NavLink>
				</>
			)}
			{!isLoggedIn && (
				<>
					<NavLink to="/signin">Log in</NavLink>
					<NavLink to="/signup">Sign Up</NavLink>
				</>
			)}
		</nav>
	);
};

export default NavMain;
