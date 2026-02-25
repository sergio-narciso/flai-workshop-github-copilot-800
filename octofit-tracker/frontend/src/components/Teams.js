import React, { useState, useEffect } from 'react';

const ENDPOINT = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  : 'http://localhost:8000/api/teams/';

const FITNESS_BADGE = { god: 'bg-purple', elite: 'bg-primary', advanced: 'bg-success', beginner: 'bg-secondary' };
function fitnessBadge(level) { return FITNESS_BADGE[level] || 'bg-secondary'; }

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Teams: fetching from', ENDPOINT);
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Teams: fetched data', data);
        setTeams(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Teams: fetch error', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <span className="me-2">⚠️</span> Failed to load teams: {error}
    </div>
  );

  return (
    <div>
      <div className="page-header d-flex align-items-center justify-content-between mb-3">
        <h2 className="h3 mb-0">🏆 Teams</h2>
        <span className="badge bg-secondary rounded-pill">{teams.length} teams</span>
      </div>

      <div className="row g-4">
        {teams.map((team) => (
          <div className="col-lg-6" key={team.id}>
            <div className="card h-100">
              <div className="card-header bg-dark text-white d-flex align-items-center justify-content-between">
                <h5 className="mb-0 fw-bold">{team.name}</h5>
                <span className="badge bg-light text-dark">
                  {(team.members || []).length} members
                </span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Fitness Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(team.members || []).map((member, idx) => (
                        <tr key={member.id}>
                          <td className="text-muted small">{idx + 1}</td>
                          <td className="fw-semibold">{member.name}</td>
                          <td><code className="text-primary">@{member.username}</code></td>
                          <td>
                            <a href={`mailto:${member.email}`} className="text-decoration-none text-muted small">
                              {member.email}
                            </a>
                          </td>
                          <td>
                            <span className={`badge text-capitalize ${fitnessBadge(member.fitness_level)}`}>
                              {member.fitness_level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-muted small mt-3">Source: <code>{ENDPOINT}</code></div>
    </div>
  );
}

export default Teams;

