import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const Navbar = ({ currentUser, setCurrentUser }) => {
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post('/logout');

      // Suppose backend returns { success: true, message: "Logged out" }
      if (res.data.success) {
        localStorage.removeItem('token');
        setCurrentUser(null); // reset currentUser state
        alert(res.data.message || "User Logged out");
        navigate("/login");
      } else {
        alert("Logout failed on server side");
      }
    } catch (err) {
      console.error('Logout failed:', err);
      alert("Error logging out");
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
