import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title:'', description:'', priority:'medium', dueDate:'' });
  const [error, setError] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/tasks/${id}`);
      setTasks(data);
    } catch { setError('Failed to load tasks'); }
  };

  const createTask = async () => {
    try {
      await API.post('/tasks', { ...newTask, project: id });
      setNewTask({ title:'', description:'', priority:'medium', dueDate:'' });
      setShowForm(false);
      fetchTasks();
    } catch (err) { setError(err.response?.data?.message || 'Failed to create task'); }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch { setError('Failed to update task'); }
  };

  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchTasks();
    } catch { setError('Failed to delete task'); }
  };

  const statusColor = { todo:'#f59e0b', 'in-progress':'#3b82f6', done:'#10b981' };
  const priorityColor = { low:'#10b981', medium:'#f59e0b', high:'#ef4444' };
  const now = new Date();

  return (
    <div style={s.page}>
      <div style={s.navbar}>
        <button onClick={() => navigate('/dashboard')} style={s.backBtn}>← Back</button>
        <h2>Project Tasks</h2>
        <button onClick={() => setShowForm(!showForm)} style={s.btn}>+ Add Task</button>
      </div>

      <div style={s.container}>
        {error && <p style={s.error}>{error}</p>}

        {showForm && (
          <div style={s.form}>
            <input style={s.input} placeholder="Task Title" value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})} />
            <input style={s.input} placeholder="Description" value={newTask.description}
              onChange={e => setNewTask({...newTask, description: e.target.value})} />
            <select style={s.input} value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input style={s.input} type="date" value={newTask.dueDate}
              onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
            <button onClick={createTask} style={s.btn}>Create</button>
            <button onClick={() => setShowForm(false)} style={s.cancelBtn}>Cancel</button>
          </div>
        )}

        {tasks.length === 0 ? (
          <p style={s.empty}>No tasks yet. Add one above!</p>
        ) : (
          <div style={s.grid}>
            {tasks.map(t => {
              const overdue = t.dueDate && new Date(t.dueDate) < now && t.status !== 'done';
              return (
                <div key={t._id} style={{...s.card, borderLeft: `4px solid ${statusColor[t.status]}`}}>
                  <div style={s.cardTop}>
                    <h4>{t.title}</h4>
                    {overdue && <span style={s.overdue}>⚠️ Overdue</span>}
                  </div>
                  <p style={s.desc}>{t.description}</p>
                  <div style={s.tags}>
                    <span style={{...s.tag, background: priorityColor[t.priority]}}>{t.priority}</span>
                    <span style={{...s.tag, background: statusColor[t.status]}}>{t.status}</span>
                  </div>
                  {t.dueDate && <p style={s.meta}>📅 {new Date(t.dueDate).toLocaleDateString()}</p>}
                  <p style={s.meta}>👤 {t.assignedTo?.name || 'Unassigned'}</p>
                  <div style={s.actions}>
                    <select style={s.select} value={t.status} onChange={e => updateStatus(t._id, e.target.value)}>
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    {user?.role === 'admin' && (
                      <button onClick={() => deleteTask(t._id)} style={s.deleteBtn}>🗑</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { minHeight:'100vh', background:'#f0f2f5' },
  navbar: { background:'#4f46e5', color:'#fff', padding:'1rem 2rem', display:'flex', justifyContent:'space-between', alignItems:'center' },
  backBtn: { background:'rgba(255,255,255,0.2)', color:'#fff', border:'none', padding:'6px 12px', borderRadius:'4px', cursor:'pointer' },
  btn: { background:'#fff', color:'#4f46e5', border:'none', padding:'8px 16px', borderRadius:'4px', cursor:'pointer', fontWeight:'bold' },
  cancelBtn: { background:'#ccc', color:'#333', border:'none', padding:'8px 16px', borderRadius:'4px', cursor:'pointer', marginLeft:'8px' },
  container: { maxWidth:'900px', margin:'2rem auto', padding:'0 1rem' },
  form: { background:'#fff', padding:'1rem', borderRadius:'8px', marginBottom:'1rem', display:'flex', gap:'8px', flexWrap:'wrap' },
  input: { padding:'8px', border:'1px solid #ddd', borderRadius:'4px', fontSize:'14px', flex:1 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:'1rem' },
  card: { background:'#fff', padding:'1.2rem', borderRadius:'8px', boxShadow:'0 2px 4px rgba(0,0,0,0.1)' },
  cardTop: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  overdue: { fontSize:'12px', color:'#ef4444' },
  desc: { fontSize:'13px', color:'#666', margin:'6px 0' },
  tags: { display:'flex', gap:'6px', margin:'8px 0' },
  tag: { fontSize:'11px', color:'#fff', padding:'2px 8px', borderRadius:'12px' },
  meta: { fontSize:'12px', color:'#888', marginTop:'4px' },
  actions: { display:'flex', gap:'8px', marginTop:'10px', alignItems:'center' },
  select: { padding:'4px 8px', borderRadius:'4px', border:'1px solid #ddd', fontSize:'13px', flex:1 },
  deleteBtn: { background:'#fee2e2', border:'none', padding:'4px 8px', borderRadius:'4px', cursor:'pointer' },
  empty: { color:'#888', textAlign:'center', marginTop:'3rem' },
  error: { color:'red', fontSize:'14px' }
};