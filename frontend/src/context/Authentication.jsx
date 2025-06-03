import { createContext, useContext, useState, useEffect } from 'react';
import { login } from '../services/User';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const Authentication = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  const loginUser = async (email, password) => {
    try {
      const adminData = await login(email, password);

      setAdmin(adminData);
      setUserToken(adminData.access_token);

      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('userToken', adminData.access_token);

      return adminData;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error('Invalid login credentials');
    }
  };

  const logout = async () => {
    setUserToken(null);
    setAdmin(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('userToken');
  };

  useEffect(() => {
    const isLoggedIn = () => {
      try {
        const usertoken = localStorage.getItem('userToken');
        const userinfo = JSON.parse(localStorage.getItem('admin')); // fixed key

        if (usertoken && userinfo) {
          setUserToken(usertoken);
          setAdmin(userinfo);
          navigate('/dashboard');
        }
      } catch (error) {
        console.log(`isLoggedIn error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ admin, loginUser, logout, userToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
