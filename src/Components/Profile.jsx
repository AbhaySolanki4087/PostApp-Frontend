import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit, Trash2, Calendar, Mail, LogOut } from 'lucide-react';
import api from '../api/axiosConfig';
import './CSS/Profile.css';

const Profile = ({ currentUser, setCurrentUser }) => { 

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (!res.data.success || !res.data.user) {
          navigate('/login');
          return;
        }
        setUserData(res.data.user);
        setFormData(res.data.user);
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch failed:', err);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSave = async () => {
  try {
    const res = await api.put('/profile', 
      { name: formData.name, bio: formData.bio } // request body
    );
    setUserData(res.data.user);
    setIsEditing(false);
    alert('Profile updated successfully!');
  } catch (err) {
    console.error('Error updating profile:', err);
    alert(err.response?.data?.message || 'Update failed.');
  }
};

  const handleCancel = () => {
    setFormData({ ...userData });
    setIsEditing(false);
  };

const handleLogout = () => {
  try{
    localStorage.removeItem('token');
    setCurrentUser(null);
    alert("Logged out successfully");
    navigate("/login");
  } catch (err) {
      console.error('Logout failed:', err);
    }
};



const handleDelete = async () => {
  if (window.confirm('Are you sure you want to delete your account?')) {
    try {
      await api.delete('/profile'); // JWT automatically included via interceptor
      localStorage.removeItem('token'); // remove token after deletion
      alert('Account deleted successfully!');
      setCurrentUser(null); // clear state
      navigate('/register');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete account.');
    } 
  }
};


  if (loading) return <div className="container">Loading profile...</div>;

  return (
    <div className="container">
      <div className="profileCard">
        <div className="profileHeader">
          <div className="profileAvatar"><User size={60} /></div>
          <h1 className="profileName">{userData.name}</h1>
          <p className="profileEmail">{userData.email}</p>
          <button onClick={handleLogout} className="btn btnLogout">
            <LogOut size={18} /> Logout
          </button>
        </div>

        <div className="profileBody">
          {!isEditing && (
            <div className="actionButtons">
              <button className="btn btnEdit" onClick={() => setIsEditing(true)}><Edit size={18} /> Edit Profile</button>
              <button className="btn btnDelete" onClick={handleDelete}><Trash2 size={18} /> Delete Account</button>
            </div>
          )}

          {isEditing && (
            <div className="editForm">
              <h3 className="sectionTitle">Edit Profile</h3>
              <div className="formGroup">
                <label className="formLabel">Username</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="formInput"/>
              </div>
              <div className="formGroup">
                <label className="formLabel">Bio</label>
                <textarea name="bio" value={formData.bio || ''} onChange={handleInputChange} className="formTextarea"/>
              </div>
              <div className="formButtons">
                <button className="btn btnSave" onClick={handleSave}>Save Changes</button>
                <button className="btn btnCancel" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          )}

          {!isEditing && (
            <>
              <div className="infoSection">
                <h3 className="sectionTitle">About</h3>
                <div className="bioText">{userData.bio || 'No bio added yet.'}</div>
              </div>
              <div className="infoSection">
                <h3 className="sectionTitle">Information</h3>
                <div className="infoGrid">
                  <div className="infoItem"><Mail size={18} /><span>{userData.email}</span></div>
                  <div className="infoItem"><Calendar size={18} /><span>Joined: {new Date(userData.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
