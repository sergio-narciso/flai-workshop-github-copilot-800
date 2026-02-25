import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Users from './components/Users';
import Teams from './components/Teams';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

console.log('App: Django REST API base URL:', API_BASE);

const NAV_ITEMS = [
  { path: '/users',       label: '👤 Users' },
  { path: '/teams',       label: '🏆 Teams' },
  { path: '/activities',  label: '🏃 Activities' },
  { path: '/leaderboard', label: '📊 Leaderboard' },
  { path: '/workouts',    label: '💪 Workouts' },
];

function App() {
  return (
    <Router>
      {/* ── Navbar ── */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img
              src="/octofitapp-small.png"
              alt="OctoFit"
              height="32"
              style={{ borderRadius: '50%' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="fw-bold">OctoFit Tracker</span>
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              {NAV_ITEMS.map(({ path, label }) => (
                <li className="nav-item" key={path}>
                  <NavLink
                    className={({ isActive }) =>
                      `nav-link px-3${isActive ? ' active fw-bold border-bottom border-white' : ''}`
                    }
                    to={path}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage apiBase={API_BASE} />} />
          <Route path="/users"       element={<Users />} />
          <Route path="/teams"       element={<Teams />} />
          <Route path="/activities"  element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts"    element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage({ apiBase }) {
  return (
    <div>
      <div className="hero-section text-center mb-4">
        <img
          src="/octofitapp-small.png"
          alt="OctoFit Tracker"
          height="80"
          style={{ borderRadius: '50%', marginBottom: '1rem' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <h1 className="display-4 fw-bold">OctoFit Tracker</h1>
        <p className="lead mt-2 mb-3">
          Track your fitness activities, compete with teams, and climb the leaderboard!
        </p>
        <a
          href={`${apiBase}/api/`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-light btn-sm"
        >
          🔗 Browse REST API
        </a>
      </div>

      <div className="row g-3 justify-content-center">
        {[
          { path: '/users',       icon: '👤', title: 'Users',       desc: 'View all registered superhero users.' },
          { path: '/teams',       icon: '🏆', title: 'Teams',       desc: 'Explore Team Marvel and Team DC.' },
          { path: '/activities',  icon: '🏃', title: 'Activities',  desc: 'Browse logged fitness activities.' },
          { path: '/leaderboard', icon: '📊', title: 'Leaderboard', desc: 'See who is at the top of the rankings.' },
          { path: '/workouts',    icon: '💪', title: 'Workouts',    desc: 'Discover personalised workout plans.' },
        ].map(({ path, icon, title, desc }) => (
          <div className="col-sm-6 col-md-4" key={path}>
            <div className="card h-100 text-center home-nav-card">
              <div className="card-body d-flex flex-column justify-content-between p-4">
                <div>
                  <div style={{ fontSize: '2.5rem' }}>{icon}</div>
                  <h5 className="card-title mt-2 fw-bold">{title}</h5>
                  <p className="card-text text-muted small">{desc}</p>
                </div>
                <NavLink to={path} className="btn btn-primary btn-sm mt-3">
                  View {title}
                </NavLink>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

