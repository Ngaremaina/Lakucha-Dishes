import './App.css';
import { Routes, Route } from "react-router-dom"
import Signup from './components/Signup';
import Login from './components/Login';
import Main from './components/Main';
import {useNavigate} from "react-router-dom"

function App() {
  const navigate = useNavigate()

  const signUpUser = (user) => {
    fetch("/signup", {
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(user)
    })
    .then(res => {
      if (res.status === 200){navigate("/login")}
    })
  }

  const loginUser = (user) => {
    fetch("/login",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(user)
    })
    .then(res => {if (res.status === 200){navigate("/")}})
  }

  return (  
    <div>
      <Routes>
        <Route path = "/register" element = {<Signup signUpUser={signUpUser}/>}></Route>
        <Route path = "/login" element = {<Login loginUser={loginUser}/>}></Route>
        <Route path = "/" element = {<Main />}></Route>
      </Routes>
    </div>
  
  );
}

export default App;
