import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Register from './Components/Register';
import Profile from './Components/Profile';
import api from './api/axiosConfig';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on app load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/api/profile', { withCredentials: true });
        if (res.data.success && res.data.user) {
          setCurrentUser(res.data.user.name);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
