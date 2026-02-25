import React, { useState, useEffect } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const ENDPOINT = `${API_BASE}/api/workouts/`;

const CARD_ACCENTS = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-secondary'];

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Workouts: fetching from', ENDPOINT);
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Workouts: fetched data', data);
        setWorkouts(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Workouts: fetch error', err);
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
      <span className="me-2">⚠️</span> Failed to load workouts: {error}
    </div>
  );

  return (
    <div>
      <div className="page-header d-flex align-items-center justify-content-between mb-3">
        <h2 className="h3 mb-0">💪 Workouts</h2>
        <span className="badge bg-secondary rounded-pill">{workouts.length} plans</span>
      </div>

      <div className="row g-4">
        {workouts.map((workout, idx) => {
          const exercises = (workout.exercises || '').split(',').map((e) => e.trim()).filter(Boolean);
          const accent = CARD_ACCENTS[idx % CARD_ACCENTS.length];
          return (
            <div className="col-md-6 col-xl-4" key={workout.id}>
              <div className="card h-100">
                <div className={`card-header ${accent} text-white`}>
                  <h5 className="mb-0 fw-bold">💪 {workout.name}</h5>
                </div>
                <div className="card-body">
                  <p className="card-text text-muted mb-3">{workout.description}</p>
                  <h6 className="fw-semibold mb-2">Exercises</h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th style={{width:'2rem'}}>#</th>
                          <th>Exercise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercises.map((ex, i) => (
                          <tr key={i}>
                            <td className="text-center text-muted small">{i + 1}</td>
                            <td>{ex}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="card-footer text-muted small bg-light">
                  {exercises.length} exercise{exercises.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-muted small mt-3">Source: <code>{ENDPOINT}</code></div>
    </div>
  );
}

export default Workouts;

