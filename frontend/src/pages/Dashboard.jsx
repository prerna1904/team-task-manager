import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await API.get('/projects');
      setProjects(data);
    } catch (err) { setError('Failed to load projects'); }
  };

  const createProject = async () => {
    try {
      await API.post('/projects', newProject);
      setNewProject({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create project'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <h2>📋 Task Manager</h2>
        <div style={s.navRight}>
          <span>👤 {user?.name} ({user?.role})</span>
          <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={s.container}>
        <div style={s.header}>
          <h3>My Projects</h3>
          {user?.role === 'admin' && (
            <button onClick={() => setShowForm(!showForm)} style={s.btn}>+ New Project</button>
          )}
        </div>

        {error && <p style={s.error}>{error}</p>}

        {showForm && (
          <div style={s.form}>
            <input style={s.input} placeholder="Project Name" value={newProject.name}
              onChange={e => setNewProject({...newProject, name: e.target.value})} />
            <input style={s.input} placeholder="Description" value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})} />
            <button onClick={createProject} style={s.btn}>Create</button>
            <button onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        )}

        {projects.length === 0 ? (
          <p style={s.empty}>No projects yet. {user?.role === 'admin' ? 'Create one above!' : 'Wait for an admin to add you.'}</p>
        ) : (
          <div style={s.grid}>
            {projects.map(p => (
              <div key={p._id} style={s.card} onClick={() => navigate(`/project/${p._id}`)}>
                <h4>{p.name}</h4>
                <p>{p.description || 'No description'}</p>
                <p style={s.meta}>👥 {p.members?.length || 0} members</p>
                <p style={s.meta}>Admin: {p.admin?.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:'100vh', background:'#f0f2f5' },
  navbar: { background:'#4f46e5', color:'#fff', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
  navRight: { display:'flex', alignItems:'center', gap:'1rem' },
  logoutBtn: { background:'rgba(255,255,255,0.2)', color:'#fff', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer' },
  container: { maxWidth:'900px', margin:'2rem auto', padding:'0 1rem' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' },
  btn: { background:'#4f46e5', color:'#fff', border:'none', padding:'8px 16px', borderRadius:'4px', cursor:'pointer' },
  cancelBtn: { background:'#ccc', color:'#333', border:'none', padding:'8px 16px', borderRadius:'4px', cursor:'pointer', marginLeft:'8px' },
  form: { background:'#fff', padding:'1rem', borderRadius:'8px', marginBottom:'1rem', display:'flex', gap:'8px', flexWrap:'wrap' },
  input: { padding:'8px', border:'1px solid #ddd', borderRadius:'4px', fontSize:'14px', flex:1 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'1rem' },
  card: { background:'#fff', padding:'1.5rem', borderRadius:'8px', cursor:'pointer', boxShadow:'0 2px 4px rgba(0,0,0,0.1)', transition:'transform 0.2s' },
  meta: { fontSize:'12px', color:'#888', marginTop:'4px' },
  empty: { color:'#888', textAlign:'center', marginTop:'3rem' },
  error: { color:'red', fontSize:'14px' }
};