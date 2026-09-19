import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const {user,logout} = useAuth(); const navigate = useNavigate();
  return <nav className="nav">
    <Link className="brand" to="/">⚡ UmuriroReport</Link>
    <div className="navlinks">
      {user && <Link to="/dashboard">Dashboard</Link>}
      {user && <Link to="/report">Report Fault</Link>}
      {user ? <button onClick={()=>{logout();navigate('/login')}}>Logout</button> : <Link to="/login">Login</Link>}
    </div>
  </nav>
}