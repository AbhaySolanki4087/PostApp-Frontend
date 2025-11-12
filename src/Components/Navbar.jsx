import { NavLink } from 'react-router-dom';
import api from '../api/axiosConfig';

const Navbar = ({ currentUser, setCurrentUser }) => {

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      setCurrentUser(null); // reset currentUser state
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navContainer">
        <NavLink to="/" className="logo">PostSphere</NavLink>
        <div className="navLinks">
          <NavLink to="/" className={({ isActive }) => isActive ? 'navLink navLinkActive' : 'navLink'}>Home</NavLink>

          {!currentUser && (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'navLink navLinkActive' : 'navLink'}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? 'navLink navLinkActive' : 'navLink'}>Register</NavLink>
            </>
          )}

          {currentUser && (
            <>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'navLink navLinkActive' : 'navLink'}>Profile</NavLink>
              <button className="navLink btnLogout" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
