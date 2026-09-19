import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {AuthProvider,useAuth} from './context/AuthContext';
import NavBar from './components/NavBar';
import Home from './pages/Home'; import Login from './pages/Login'; import Register from './pages/Register'; import Dashboard from './pages/Dashboard'; import ReportFault from './pages/ReportFault';

function Private({children}){const {user}=useAuth();return user?children:<Navigate to="/login"/>}
export default function App(){return <AuthProvider><BrowserRouter><NavBar/><Routes>
<Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
<Route path="/dashboard" element={<Private><Dashboard/></Private>}/><Route path="/report" element={<Private><ReportFault/></Private>}/>
</Routes></BrowserRouter></AuthProvider>}