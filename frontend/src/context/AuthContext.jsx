import { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user,setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const login = async (email,password) => {
    const {data} = await api.post('/auth/login',{email,password});
    localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user);
  };
  const register = async form => {
    const {data} = await api.post('/auth/register',form);
    localStorage.setItem('token',data.token); localStorage.setItem('user',JSON.stringify(data.user)); setUser(data.user);
  };
  const logout = () => { localStorage.clear(); setUser(null); };
  return <AuthContext.Provider value={{user,login,register,logout}}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);