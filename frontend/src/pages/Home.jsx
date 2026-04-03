import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Edit3, CheckCircle, Lock } from 'lucide-react';

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <div className="home-layout">
      <header className="home-header">
        <h1 className="home-logo">
          <Edit3 size={28} /> My Personal Notes
        </h1>
        <div className="home-nav">
          {user ? (
            <Link to="/dashboard" className="btn-primary nav-btn">Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="home-login-link">Sign In</Link>
              <Link to="/register" className="btn-primary nav-btn">Get Started</Link>
            </>
          )}
        </div>
      </header>

      <main className="home-main">
        <h2 className="home-hero-title">
          Capture your thoughts,<br /> <span>anytime, anywhere.</span>
        </h2>
        <p className="home-hero-subtitle">
          A simple, fast, and secure place to store your daily notes, ideas, and to-do lists.
          Accessible across all your devices seamlessly.
        </p>

        {!user && (
          <Link to="/register" className="btn-primary home-cta">
            Start Taking Notes for Free
          </Link>
        )}

        <div className={`home-features ${user ? 'mt-2' : ''}`}>
          <div className="feature-card">
            <CheckCircle size={32} className="feature-icon" />
            <h3>Simple & Clean</h3>
            <p>A clutter-free interface designed to help you focus entirely on your writing without distractions.</p>
          </div>
          <div className="feature-card">
            <Lock size={32} className="feature-icon" />
            <h3>Secure & Private</h3>
            <p>Your notes are protected and only accessible to you. Your peace of mind is our priority.</p>
          </div>
          <div className="feature-card">
            <Edit3 size={32} className="feature-icon" />
            <h3>Rich Experience</h3>
            <p>Organize your thoughts on the fly with a flexible note-taking system and sleek dark mode.</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} My Persnal Notes. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
