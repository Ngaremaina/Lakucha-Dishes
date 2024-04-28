import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext();

export const Authentication = ({ children }) => {
    const [admin, setAdmin] = useState(null)
    const [userToken, setUserToken] = useState(null)
    
  const loginUser = async (user) => {
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error('Invalid login credentials');
      }

      const adminData = await response.json();
      setAdmin(adminData);
      setUserToken(adminData.access_token)

      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('userToken', adminData.access_token)


      return adminData;
    } catch (error) {
      throw new Error('An error occurred during login');
    }
  };

  const logout = async () => {
    setUserToken(null)
    localStorage.removeItem('admin')
    localStorage.removeItem('userToken')
  };
  const isLoggedIn = async () =>{
    try{
        
        let usertoken = await localStorage.getItem('userToken') 
        let userinfo = await localStorage.getItem('userInfo')
        userinfo = JSON.parse(userinfo)
        if (userinfo){
            setUserToken(usertoken)
            setAdmin(userinfo)
        }
        
    }
    catch(error){
        console.log(`isLogged in error ${error}`)
    }
    
  }

  
  useEffect(() => {
    isLoggedIn()
    
  }, []);
  

  return (
    <AuthContext.Provider value={{ admin, loginUser, logout, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};