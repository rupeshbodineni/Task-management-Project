import React, { useState, useEffect } from 'react';
import { tasksApi } from '../api';

function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState(null);
  const [editingId, setEditingId] = useState(null);
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDING');

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async (filterStatus = null) => {
    try {
      setError('');
      setLoading(true);
      const data = await tasksApi.getAll(filterStatus);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required');
      return;
    }

    try {
      setError('');
      if (editingId) {
        await tasksApi.update(editingId, {
          title,
          description,
          status,
        });
        setSuccess('Task updated successfully');
      } else {
        await tasksApi.create(title, description, status);
        setSuccess('Task created successfully');
      }
      
      setTitle('');
      setDescription('');
      setStatus('PENDING');
      setEditingId(null);
      loadTasks(filter);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save task');
    }
  };

  const handleEditTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setError('');
        await tasksApi.delete(id);
        setSuccess('Task deleted successfully');
        loadTasks(filter);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to delete task');
      }
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    loadTasks(newFilter);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setStatus('PENDING');
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="user-info">
          <div>
            <p>Welcome, <strong>{user.name}</strong></p>
            <p style={{ fontSize: '12px', opacity: 0.9 }}>{user.email}</p>
          </div>
          <button className="btn btn-danger" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {error && <div className="message error">{error}</div>}
        {success && <div className="message success">{success}</div>}

        {/* Task Form */}
        <div className="task-form">
          <h2>{editingId ? 'Edit Task' : 'Create New Task'}</h2>
          <form onSubmit={handleCreateTask}>
            <div className="form-row full">
              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task description"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontFamily: 'inherit',
                    fontSize: '14px',
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingId ? 'Update Task' : 'Create Task'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCancel}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          <h2>Your Tasks</h2>

          {/* Filters */}
          <div className="tasks-filters">
            <button
              className={filter === null ? 'active' : ''}
              onClick={() => handleFilterChange(null)}
            >
              All
            </button>
            <button
              className={filter === 'PENDING' ? 'active' : ''}
              onClick={() => handleFilterChange('PENDING')}
            >
              Pending
            </button>
            <button
              className={filter === 'IN_PROGRESS' ? 'active' : ''}
              onClick={() => handleFilterChange('IN_PROGRESS')}
            >
              In Progress
            </button>
            <button
              className={filter === 'COMPLETED' ? 'active' : ''}
              onClick={() => handleFilterChange('COMPLETED')}
            >
              Completed
            </button>
          </div>

          {/* Tasks List */}
          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-meta">
                    <span className={`task-status ${task.status}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                    <div className="task-actions">
                      <button
                        className="task-actions btn-edit"
                        onClick={() => handleEditTask(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
