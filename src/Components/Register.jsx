import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'
import './CSS/Styles.css';

function Register() {
  
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

     try {
        const res = await api.post('/register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (res.data.success) {
          alert(`Account created successfully! Welcome, ${formData.name}!`);
          navigate('/login'); // redirect to login after successful registration
        } else {
          setError(res.data.message || 'Registration failed');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Server error during registration');
      }
  };

  return (
    <div className="pageContainer" >
      <div className="formCard">
        <div className="formHeader">
          <h2 className="formTitle">Create Account</h2>
          <p className="formSubtitle">Join us today</p>
        </div>

        <div className="formBody">
          <div className="formGroup">
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="enter name"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="reg-email" className="label">
              Email Address
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="reg-password" className="label">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="errorBox">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            className=" submitButton"
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Create Account
          </button>
        </div>

        <p className="formFooter">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')}
            className="linkButton"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};


export default Register
