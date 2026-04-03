import React, { useState, useEffect, useContext } from 'react';
import { Home, Plus, Settings, LogOut, Grid, List as ListIcon, Edit2, Trash2, Search, Bold, Italic, Link as LinkIcon, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [activeTab, setActiveTab] = useState('notes');
  const [darkMode, setDarkMode] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  // Quick Add State
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');

  // Edit Modal State
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes', err);
    }
  };

  const handleAddNote = async (e) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await api.post('/notes', { title: newTitle, body: newBody });
      setNotes([res.data, ...notes]);
      setNewTitle('');
      setNewBody('');
    } catch (err) {
      console.error('Error adding note', err);
    }
  };

  const handleDeleteNote = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      console.error('Error deleting note', err);
    }
  };

  const handleEditClick = (note, e) => {
    if (e) e.stopPropagation();
    setEditingNote(note);
    setEditTitle(note.title);
    setEditBody(note.body);
  };

  const handleUpdateNote = async () => {
    try {
      const res = await api.put(`/notes/${editingNote._id}`, { title: editTitle, body: editBody });
      setNotes(notes.map(note => (note._id === editingNote._id ? res.data : note)));
      setEditingNote(null);
    } catch (err) {
      console.error('Error updating note', err);
    }
  };

  const userInitials = user ? user.username.substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="app-layout">
      {/* Left Sidebar */}
      <aside className="sidebar desktop-only">
        <div className="user-avatar">{userInitials}</div>
        <button className={`nav-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')} title="Notes"><Home size={22} /></button>
        <button className={`nav-item ${activeTab === 'quick-add' ? 'active' : ''}`} onClick={() => setActiveTab('quick-add')} title="Quick Add Note"><Plus size={22} /></button>
        <button className="nav-item" title="Settings" onClick={() => setShowRightSidebar(!showRightSidebar)}><Settings size={22} /></button>
        <button className="nav-item logout" onClick={logout} title="Log Out"><LogOut size={22} /></button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-left">
            <div className="user-avatar-small">{userInitials}</div>
          </div>
          <h1>My Persnal Notes</h1>
          <div className="header-right">
            <button className="header-btn"><Search size={22} /></button>
            <button className="header-btn" onClick={() => setShowRightSidebar(!showRightSidebar)}><Settings size={22} /></button>
          </div>
        </header>

        <nav className="mobile-tabs">
          <button className={`tab-item ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>Notes</button>
          <button className={`tab-item ${activeTab === 'quick-add' ? 'active' : ''}`} onClick={() => setActiveTab('quick-add')}>Quick Add</button>
          <button className={`tab-item ${activeTab === 'manage' ? 'active' : ''}`} onClick={() => setActiveTab('manage')}>Manage</button>
        </nav>

        <div className="content-container">
          {/* Quick Add Section */}
          <div className={`quick-add-section ${(activeTab === 'quick-add' || activeTab === 'notes') ? 'show' : 'hide'}`}>
            <div className="quick-add-card">
              <div className="quick-add-header">
                <span>Quick Add Note</span>
                <MoreHorizontal size={20} />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Title"
                  className="quick-add-input"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="input-group">
                <div className="body-label">
                  <span>Body</span>
                  <div className="toolbar-icons">
                    <Bold size={16} />
                    <Italic size={16} />
                    <LinkIcon size={16} />
                  </div>
                </div>
                <textarea
                  className="quick-add-textarea"
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                ></textarea>
              </div>
              <div className="quick-add-footer">
                <button className="btn-primary-rect" onClick={handleAddNote}>
                  Add Note
                </button>
              </div>
            </div>
          </div>

          {/* Manage Tab Content */}
          <div className={`manage-section ${activeTab === 'manage' ? 'show' : 'hide'}`}>
            <div className="manage-card">
              <h3>Account Settings</h3>
              <p>Logged in as: <strong>{user?.username}</strong></p>
              <button className="btn-danger" style={{ marginTop: '1rem', width: '100%' }} onClick={logout}>
                <LogOut size={16} /> Log Out
              </button>
            </div>
          </div>

          {/* Notes Section (Grid or List) */}
          <div className={`notes-list-section ${activeTab === 'notes' ? 'show' : 'hide'}`}>
            <div className="section-header">
              <h2 className="section-title">My Notes</h2>
              <div className="view-mode-indicator">
                Viewing as {viewMode}
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="notes-grid">
                {notes.map(note => (
                  <div key={note._id} className="note-card" onClick={() => handleEditClick(note)}>
                    <div className="card-header">
                      <h3 className="note-title">{note.title}</h3>
                      <button className="icon-btn-danger" onClick={(e) => handleDeleteNote(note._id, e)}><Trash2 size={16} /></button>
                    </div>
                    <p className="note-body">{note.body}</p>
                    <p className="note-date">last modified {note.updatedAt ? format(new Date(note.updatedAt), 'MMM d, yyyy') : 'Recently'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="notes-flat-list">
                {notes.map(note => (
                  <div key={note._id} className="list-item" onClick={() => handleEditClick(note)}>
                    <div className="item-main">
                      <span className="item-title">{note.title}</span>
                      <div className="item-tags">
                        <span className="tag tag-blue">work</span>
                        <span className="tag tag-green">ideas</span>
                      </div>
                    </div>
                    <div className="item-right">
                      <span className="item-date">{note.updatedAt ? format(new Date(note.updatedAt), 'MMM d, yyyy') : 'Oct 16, 2023'}</span>
                      <button className="icon-btn-danger" onClick={(e) => handleDeleteNote(note._id, e)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="fab-container">
            <button className="fab-btn" onClick={() => setActiveTab('quick-add')}><Plus size={28} /></button>
          </div>

          <div className="more-btn-container">
            <button className="more-pill">More</button>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className={`right-sidebar ${showRightSidebar ? 'open' : ''}`}>
          <div className="settings-section">
            <h3>Quick Settings</h3>
            <div className="view-toggle">
              <button
                className={`view-option ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={18} /> Grid View
              </button>
              <button
                className={`view-option ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <ListIcon size={18} /> List View
              </button>
            </div>
          </div>

          <div className="settings-section">
            <div className="switch-group">
              <span className="switch-label">Dark mode</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </aside>
      </main>

      {/* Edit Modal */}
      {editingNote && (
        <div className="modal-overlay" onClick={() => setEditingNote(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Note</h2>
              <button className="close-btn" onClick={() => setEditingNote(null)}>&times;</button>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                className="form-input"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Body</label>
              <textarea
                className="quick-add-textarea"
                style={{ height: '200px' }}
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
              ></textarea>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditingNote(null)}>Cancel</button>
              <button className="btn-primary" style={{ width: 'auto', marginTop: 0 }} onClick={handleUpdateNote}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
