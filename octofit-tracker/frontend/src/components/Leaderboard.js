import React, { useState, useEffect } from 'react';

const ENDPOINT = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  : 'http://localhost:8000/api/leaderboard/';

function rankStyle(rank) {
  if (rank === 1) return { background: '#ffd700', color: '#333' };
  if (rank === 2) return { background: '#c0c0c0', color: '#333' };
  if (rank === 3) return { background: '#cd7f32', color: '#fff' };
  return { background: '#e9ecef', color: '#495057' };
}

function rankLabel(rank) {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank;
}

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Leaderboard: fetching from', ENDPOINT);
    fetch(ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log('Leaderboard: fetched data', data);
        const items = Array.isArray(data) ? data : data.results || [];
        items.sort((a, b) => b.score - a.score);
        setEntries(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Leaderboard: fetch error', err);
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
      <span className="me-2">⚠️</span> Failed to load leaderboard: {error}
    </div>
  );

  const topScore = entries[0]?.score || 1;

  return (
    <div>
      <div className="page-header d-flex align-items-center justify-content-between mb-3">
        <h2 className="h3 mb-0">📊 Leaderboard</h2>
        <span className="badge bg-secondary rounded-pill">{entries.length} athletes</span>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{width:'4rem'}}>Rank</th>
                  <th>Athlete</th>
                  <th>Score</th>
                  <th style={{width:'30%'}}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => {
                  const rank = idx + 1;
                  const name = typeof entry.user === 'object' ? entry.user?.name : entry.user;
                  const pct = Math.round((entry.score / topScore) * 100);
                  return (
                    <tr key={entry.id}>
                      <td className="text-center">
                        <span
                          className="d-inline-flex align-items-center justify-content-center fw-bold"
                          style={{
                            ...rankStyle(rank),
                            width: '2rem', height: '2rem',
                            borderRadius: '50%', fontSize: '0.85rem',
                          }}
                        >
                          {rankLabel(rank)}
                        </span>
                      </td>
                      <td className="fw-semibold">{name}</td>
                      <td>
                        <span className="badge bg-dark fs-6">{entry.score.toLocaleString()}</span>
                      </td>
                      <td>
                        <div className="progress" style={{height:'0.6rem'}}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{width:`${pct}%`}}
                            aria-valuenow={pct}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          />
                        </div>
                        <div className="text-muted" style={{fontSize:'0.7rem'}}>{pct}%</div>
                      </td>
                    </tr>
                  );
                })}
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

export default Leaderboard;

