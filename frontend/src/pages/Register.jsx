import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Team Task Manager</h2>
        <h3>Register</h3>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} placeholder="Name" value={form.name}
            onChange={e => setForm({...form, name: e.target.value})} required />
          <input style={styles.input} placeholder="Email" type="email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
          <input style={styles.input} placeholder="Password" type="password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          <select style={styles.input} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button style={styles.button} type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/">Login</Link></p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' },
  card: { background:'#fff', padding:'2rem', borderRadius:'8px', width:'360px', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column', gap:'1rem' },
  input: { width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'4px', border:'1px solid #ddd', fontSize:'14px', boxSizing:'border-box' },
  button: { width:'100%', padding:'10px', background:'#4f46e5', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'16px' },
  error: { color:'red', fontSize:'14px' }
};