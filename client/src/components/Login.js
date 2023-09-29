import React, { useState } from "react";
import { Link } from "react-router-dom";
const Login = ({loginUser}) => {
    const [user, setUser] = useState({
        email:"",
        password:""
    })
    const handleSubmit = (event) => {
        event.preventDefault()
        loginUser(user)
    }
    const handleChange = (event) => {
        const input = event.target.name
        const value = event.target.value
        setUser(prev => {return {...prev, [input]: value}})
    }

    return(
        <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="my-3">
                <label>Email address</label>
                <input type="email" className="form-control" id="floatingInput" placeholder="johndoe@example.com" onChange={handleChange} name="email" value={user.email}/>
              </div>
              <div className="my-3">
                <label>Password</label>
                <input type="password" class="form-control" id="floatingPassword" placeholder="password" onChange={handleChange} name ="password" value={user.password}/>
              </div>
              <div className="my-3">
                <p>Don't have an account? <Link to="/signup" className="text-decoration-underline text-info">Click here to Register</Link> </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        </div>
    )

}

export default Login