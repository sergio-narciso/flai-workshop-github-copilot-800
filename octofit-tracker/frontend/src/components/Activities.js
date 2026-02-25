import React, { useState, useEffect } from 'react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  // Append T00:00:00 to force local time interpretation and avoid UTC timezone shift
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const ENDPOINT = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  : 'http://localhost:8000/api/activities/';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Activities: fetching from', ENDPOINT);
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Activities: fetched data', data);
        setActivities(Array.isArray(data) ? data : data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Activities: fetch error', err);
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
      <span className="me-2">⚠️</span> Failed to load activities: {error}
    </div>
  );

  const totalMinutes = activities.reduce((sum, a) => sum + (parseFloat(a.duration) || 0), 0);

  return (
    <div>
      <div className="page-header d-flex align-items-center justify-content-between mb-3">
        <h2 className="h3 mb-0">🏃 Activities</h2>
        <span className="badge bg-secondary rounded-pill">{activities.length} logged</span>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-sm-4">
          <div className="card text-center">
            <div className="card-body py-3">
              <div className="h4 fw-bold text-primary mb-0">{activities.length}</div>
              <div className="text-muted small">Total Activities</div>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card text-center">
            <div className="card-body py-3">
              <div className="h4 fw-bold text-success mb-0">{totalMinutes.toFixed(0)}</div>
              <div className="text-muted small">Total Minutes</div>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card text-center">
            <div className="card-body py-3">
              <div className="h4 fw-bold text-info mb-0">
                {activities.length ? (totalMinutes / activities.length).toFixed(1) : 0}
              </div>
              <div className="text-muted small">Avg Duration (min)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{width:'3rem'}}>#</th>
                  <th>User</th>
                  <th>Activity Type</th>
                  <th>Duration (min)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity, idx) => (
                  <tr key={activity.id}>
                    <td className="text-muted small">{idx + 1}</td>
                    <td className="fw-semibold">
                      {typeof activity.user === 'object' ? activity.user?.name : activity.user}
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">{activity.activity_type}</span>
                    </td>
                    <td>{activity.duration}</td>
                    <td>
                      <span className="text-muted small">{formatDate(activity.date)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-muted small bg-light">
          Source: <code>{ENDPOINT}</code>
        </div>
      </div>
    </div>
  );
}

export default Activities;

