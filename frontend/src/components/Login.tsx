import React, { useContext, useEffect, useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      navigate('/profile');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/token/`, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(email + ':' + password),
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'An error occurred');
      }

      localStorage.setItem('token', data.access_token);
      setIsAuthenticated(true);
      navigate('/profile');
    } catch (err) {
      // setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="login">
      <h1>Вход</h1>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Выйти</button>
      ) : (
        <>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Войти</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;