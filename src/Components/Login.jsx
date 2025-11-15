import React ,{useState}from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/Styles.css';
import api from '../api/axiosConfig';

function Login({ setCurrentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Enter a valid email');
      return;
    }

    setLoading(true); // ✅ Start loading before API call
    try {
      const res = await api.post('/api/login', formData);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        if (typeof setCurrentUser === 'function') setCurrentUser(res.data.user.name);
        alert(`Welcome back, ${res.data.user.name}`);
        navigate('/profile');
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false); // ✅ Stop loading after API call, even on error
    }
  };


  return (
    <div className="pageContainer" style={{ backgroundImage: `url('/loginBG.png')`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh'}}>
      <div className="formCard">
        <div className="formHeader">
          <h2 className="formTitle">Welcome Back</h2>
          <p className="formSubtitle">Sign in to your account</p>
        </div>
        {/* Login Form  */}
        <form onSubmit={handleSubmit}> 
          <div className="formBody">
            <div className="formGroup">
              <label htmlFor="email" className="label">Email Address</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="input" placeholder="you@example.com"/>
            </div>
            <div className="formGroup">
              <label htmlFor="password" className="label">Password</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} className="input" placeholder="••••••••"/>
            </div>
            {error && <div className="errorBox">{error}</div>}
            <button 
              type="submit" 
              className="submitButton" 
              // disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="formFooter">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="linkButton">Sign up</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
