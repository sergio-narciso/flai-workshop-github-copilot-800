import React, { useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
  : 'http://localhost:8000';

const USERS_ENDPOINT = `${API_BASE}/api/users/`;
const TEAMS_ENDPOINT = `${API_BASE}/api/teams/`;

const FITNESS_LEVELS = ['beginner', 'advanced', 'elite', 'god'];
const FITNESS_BADGE = { god: 'bg-purple', elite: 'bg-primary', advanced: 'bg-success', beginner: 'bg-secondary' };
function fitnessBadge(level) { return FITNESS_BADGE[level] || 'bg-secondary'; }

const EMPTY_FORM = { name: '', username: '', email: '', age: '', fitness_level: 'beginner', team_ids: [] };

function Users() {
  const [users, setUsers]         = useState([]);
  const [teams, setTeams]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [editUser, setEditUser]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.all([
      fetch(USERS_ENDPOINT).then(r => { if (!r.ok) throw new Error(`Users: HTTP ${r.status}`); return r.json(); }),
      fetch(TEAMS_ENDPOINT).then(r => { if (!r.ok) throw new Error(`Teams: HTTP ${r.status}`); return r.json(); }),
    ])
      .then(([uData, tData]) => {
        setUsers(Array.isArray(uData) ? uData : uData.results || []);
        setTeams(Array.isArray(tData) ? tData : tData.results || []);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function openEdit(user) {
    const currentTeamIds = (user.teams || []).map(t => parseInt(t.id, 10));
    setForm({
      name:          user.name || '',
      username:      user.username || '',
      email:         user.email || '',
      age:           user.age ?? '',
      fitness_level: user.fitness_level || 'beginner',
      team_ids:      currentTeamIds,
    });
    setSaveError(null);
    setSaveSuccess(false);
    setEditUser(user);
  }

  function closeEdit() {
    setEditUser(null);
    setSaveError(null);
    setSaveSuccess(false);
  }

  function handleField(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleTeamToggle(teamId) {
    setForm(f => ({
      ...f,
      team_ids: f.team_ids.includes(teamId)
        ? f.team_ids.filter(id => id !== teamId)
        : [...f.team_ids, teamId],
    }));
  }

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const payload = {
      name:          form.name,
      username:      form.username,
      email:         form.email,
      age:           parseInt(form.age, 10) || 0,
      fitness_level: form.fitness_level,
      team_ids:      form.team_ids,
    };

    fetch(`${USERS_ENDPOINT}${editUser.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(r => {
        if (!r.ok) return r.text().then(t => { throw new Error(t || `HTTP ${r.status}`); });
        return r.json();
      })
      .then(() => {
        setSaving(false);
        setSaveSuccess(true);
        fetchAll();
        setTimeout(closeEdit, 800);
      })
      .catch(err => {
        setSaving(false);
        setSaveError(err.message);
      });
  }

  if (loading) return (
    <div className="spinner-wrapper">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger d-flex align-items-center" role="alert">
      <span className="me-2">⚠️</span> Failed to load users: {error}
    </div>
  );

  return (
    <div>
      <div className="page-header d-flex align-items-center justify-content-between mb-3">
        <h2 className="h3 mb-0">👤 Users</h2>
        <span className="badge bg-secondary rounded-pill">{users.length} members</span>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{width:'3rem'}}>#</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Fitness Level</th>
                  <th>Teams</th>
                  <th style={{width:'5rem'}}></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id}>
                    <td className="text-muted small">{idx + 1}</td>
                    <td className="fw-semibold">{user.name}</td>
                    <td><code className="text-primary">@{user.username}</code></td>
                    <td>
                      <a href={`mailto:${user.email}`} className="text-decoration-none text-muted small">
                        {user.email}
                      </a>
                    </td>
                    <td>{user.age}</td>
                    <td>
                      <span className={`badge text-capitalize ${fitnessBadge(user.fitness_level)}`}>
                        {user.fitness_level}
                      </span>
                    </td>
                    <td>
                      {(user.teams || []).map(t => (
                        <span key={t.id} className="badge bg-info text-dark me-1">{t.name}</span>
                      ))}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEdit(user)}
                        title="Edit user"
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer text-muted small bg-light">
          Showing {users.length} user{users.length !== 1 ? 's' : ''} &mdash; <code>{USERS_ENDPOINT}</code>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      {editUser && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">✏️ Edit User — <code>@{editUser.username}</code></h5>
                  <button type="button" className="btn-close" onClick={closeEdit} aria-label="Close"></button>
                </div>
                <form onSubmit={handleSave}>
                  <div className="modal-body">
                    {saveError && (
                      <div className="alert alert-danger py-2 small">⚠️ {saveError}</div>
                    )}
                    {saveSuccess && (
                      <div className="alert alert-success py-2 small">✅ Saved successfully!</div>
                    )}

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Full Name</label>
                        <input
                          type="text" name="name" value={form.name}
                          onChange={handleField} className="form-control" required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Username</label>
                        <div className="input-group">
                          <span className="input-group-text">@</span>
                          <input
                            type="text" name="username" value={form.username}
                            onChange={handleField} className="form-control" required
                          />
                        </div>
                      </div>
                      <div className="col-md-8">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                          type="email" name="email" value={form.email}
                          onChange={handleField} className="form-control" required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold">Age</label>
                        <input
                          type="number" name="age" value={form.age} min="1" max="120"
                          onChange={handleField} className="form-control" required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Fitness Level</label>
                        <select
                          name="fitness_level" value={form.fitness_level}
                          onChange={handleField} className="form-select"
                        >
                          {FITNESS_LEVELS.map(l => (
                            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold d-block">Teams</label>
                        {teams.length === 0 && <span className="text-muted small">No teams available</span>}
                        {teams.map(team => {
                          const tid = parseInt(team.id, 10);
                          return (
                            <div key={team.id} className="form-check form-check-inline">
                              <input
                                className="form-check-input" type="checkbox"
                                id={`team-${team.id}`}
                                checked={form.team_ids.includes(tid)}
                                onChange={() => handleTeamToggle(tid)}
                              />
                              <label className="form-check-label" htmlFor={`team-${team.id}`}>
                                {team.name}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeEdit}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                      {saving ? (
                        <><span className="spinner-border spinner-border-sm me-1" role="status"></span>Saving…</>
                      ) : '💾 Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeEdit}></div>
        </>
      )}
    </div>
  );
}

export default Users;

