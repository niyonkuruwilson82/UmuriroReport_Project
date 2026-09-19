import {useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Login(){
 const [form,setForm]=useState({email:'',password:''}); const [error,setError]=useState(''); const {login}=useAuth(); const nav=useNavigate();
 const submit=async e=>{e.preventDefault();try{await login(form.email,form.password);nav('/dashboard')}catch(err){setError(err.response?.data?.message||'Login failed')}};
 return <div className="auth"><form className="card" onSubmit={submit}><h2>Login</h2>{error&&<div className="error">{error}</div>}
 <label>Email<input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
 <label>Password<input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></label>
 <button className="btn">Login</button><p>No account? <Link to="/register">Register</Link></p>
 <small>Demo admin: admin@umuriro.rw / Admin@123</small></form></div>
}