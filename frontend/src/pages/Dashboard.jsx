import {useEffect,useState} from 'react';
import api from '../services/api';
import {useAuth} from '../context/AuthContext';

export default function Dashboard(){
 const {user}=useAuth(); const [faults,setFaults]=useState([]); const [stats,setStats]=useState(null); const [techs,setTechs]=useState([]);
 const load=()=>api.get('/faults').then(r=>setFaults(r.data));
 useEffect(()=>{load(); if(user.role==='admin'){api.get('/faults/stats').then(r=>setStats(r.data));api.get('/faults/technicians').then(r=>setTechs(r.data))}},[]);
 const status=async(id,value)=>{await api.patch(`/faults/${id}/status`,{status:value});load();};
 const assign=async(id,value)=>{await api.patch(`/faults/${id}/assign`,{technician_id:value});load();};
 return <main className="page"><div className="pagehead"><div><h2>Dashboard</h2><p>Welcome, {user.full_name}</p></div><span className="role">{user.role}</span></div>
 {stats&&<div className="stats">{[['Total',stats.total],['Pending',stats.pending],['In Progress',stats.inProgress],['Resolved',stats.resolved],['Technicians',stats.technicians]].map(x=><div className="stat" key={x[0]}><b>{x[1]}</b><span>{x[0]}</span></div>)}</div>}
 <div className="card wide"><h3>{user.role==='user'?'My Fault Reports':user.role==='technician'?'Assigned Faults':'All Fault Reports'}</h3>
 <div className="tablewrap"><table><thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Reporter</th><th>Status</th>{user.role==='admin'&&<th>Assign</th>}{user.role!=='user'&&<th>Update</th>}</tr></thead>
 <tbody>{faults.map(f=><tr key={f.fault_id}><td>#{f.fault_id}</td><td>{f.title}</td><td>{f.category||'—'}</td><td>{f.reporter}</td><td><span className={'status '+f.status.replace(' ','-').toLowerCase()}>{f.status}</span></td>
 {user.role==='admin'&&<td><select value={f.technician_id||''} onChange={e=>e.target.value&&assign(f.fault_id,e.target.value)}><option value="">Assign...</option>{techs.map(t=><option key={t.user_id} value={t.user_id}>{t.full_name}</option>)}</select></td>}
 {user.role!=='user'&&<td><select value={f.status} onChange={e=>status(f.fault_id,e.target.value)}><option>Pending</option><option>In Progress</option><option>Resolved</option></select></td>}
 </tr>)}</tbody></table></div></div></main>
}