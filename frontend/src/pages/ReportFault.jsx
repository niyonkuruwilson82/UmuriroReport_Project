import {useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import MapPicker from '../components/MapPicker';

export default function ReportFault(){
 const [cats,setCats]=useState([]); const [position,setPosition]=useState(null);
 const [form,setForm]=useState({title:'',description:'',category_id:'',address:'',photo:null}); const [msg,setMsg]=useState('');
 const nav=useNavigate();
 useEffect(()=>{api.get('/faults/categories').then(r=>setCats(r.data))},[]);
 const submit=async e=>{e.preventDefault();const data=new FormData();data.append('title',form.title);data.append('description',form.description);data.append('category_id',form.category_id);data.append('address',form.address);if(position){data.append('latitude',position[0]);data.append('longitude',position[1])}if(form.photo)data.append('photo',form.photo);
 try{await api.post('/faults',data);setMsg('Fault submitted successfully.');setTimeout(()=>nav('/dashboard'),700)}catch(err){setMsg(err.response?.data?.message||'Could not submit report')}};
 return <main className="page"><div className="card wide"><h2>Report Electricity Fault</h2>{msg&&<div className="success">{msg}</div>}
 <form onSubmit={submit} className="grid">
 <label>Fault title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
 <label>Fault category<select value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}><option value="">Select category</option>{cats.map(c=><option key={c.category_id} value={c.category_id}>{c.name}</option>)}</select></label>
 <label className="full">Description<textarea required rows="5" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
 <label>Address/location<input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label>
 <label>Photo<input type="file" accept="image/*" onChange={e=>setForm({...form,photo:e.target.files[0]})}/></label>
 <div className="full"><h3>Select fault location on map</h3><MapPicker position={position} setPosition={setPosition}/>{position&&<p>GPS: {position[0].toFixed(6)}, {position[1].toFixed(6)}</p>}</div>
 <button className="btn full">Submit Fault Report</button>
 </form></div></main>
}