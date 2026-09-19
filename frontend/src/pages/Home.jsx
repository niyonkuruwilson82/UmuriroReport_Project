import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
 const {user}=useAuth();
 return <main className="hero">
   <div>
    <span className="tag">Rwanda Electricity Fault Reporting</span>
    <h1>Report electricity faults. Track progress. Stay informed.</h1>
    <p>UmuriroReport helps citizens report outages, damaged poles, cables and other electricity problems with a location and photo.</p>
    <div className="actions">{user ? <Link className="btn" to="/dashboard">Open Dashboard</Link> : <><Link className="btn" to="/register">Create Account</Link><Link className="btn secondary" to="/login">Login</Link></>}</div>
   </div>
   <div className="hero-card"><div>⚡</div><h3>Pending → In Progress → Resolved</h3><p>Follow every report from submission to completion.</p></div>
 </main>
}