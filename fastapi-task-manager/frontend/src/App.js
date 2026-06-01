import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" />
            ) : (
              <Register onRegister={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
