import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function Register(){
 const [form,setForm]=useState({full_name:'',email:'',phone:'',password:'',address:''}); const [error,setError]=useState(''); const {register}=useAuth(); const nav=useNavigate();
 const submit=async e=>{e.preventDefault();try{await register(form);nav('/dashboard')}catch(err){setError(err.response?.data?.message||'Registration failed')}};
 const update=e=>setForm({...form,[e.target.name]:e.target.value});
 return <div className="auth"><form className="card" onSubmit={submit}><h2>Create Account</h2>{error&&<div className="error">{error}</div>}
 {['full_name','email','phone','address','password'].map(x=><label key={x}>{x.replace('_',' ').toUpperCase()}<input name={x} type={x==='password'?'password':'text'} required={['full_name','email','password'].includes(x)} value={form[x]} onChange={update}/></label>)}
 <button className="btn">Register</button></form></div>
}