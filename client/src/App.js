import './App.css';
import { Routes, Route } from "react-router-dom"
import Signup from './components/Signup';
import NavHeader from './components/Navbar';
import Login from './components/Login';
function App() {
  return (  
    <div>
      <NavHeader />
      
      <Routes>
        <Route path = "/register" element = {<Signup />}></Route>
        <Route path = "/login" element = {<Login />}></Route>

      </Routes>
      

    </div>
    
      
    
  );
}

export default App;
