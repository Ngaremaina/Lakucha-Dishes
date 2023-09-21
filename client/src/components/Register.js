import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Register = ({registerUser}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        username:"",
        email:"",
        password:"",
        role:"client"
    })
    const handleChange = (event) => {
        const input = event.target.name
        const value = event.target.value
        setUser(prev => {return {...prev, [input]:value}})
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        registerUser(user)
        navigate("/login")
    }
    return(
        <div className="container my-3 py-3">
            <h1 className="text-center">Register</h1>
            <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="form my-3">
                                <label>Username</label>
                                <input type="text" className="form-control" id="Name" placeholder="John Doe" onChange={handleChange} name="username" value={user.username}/>
                            </div>
                            <div className="form my-3">
                                <label>Email address</label>
                                <input type="email" className="form-control" id="Email" placeholder="johndoe@example.com" onChange={handleChange} name="email" value={user.email}/>
                            </div>
                            <div className="form  my-3">
                                <label>Password</label>
                                <input type="password" className="form-control" id="Password" placeholder="password" onChange={handleChange} name = "password" value={user.password} />
                            </div>
                            
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit">Register</button>
                            </div>
                            <div className="my-3">
                                <p>Already have an account? <Link to="/login" className="text-decoration-underline text-info">Click here to Login</Link> </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    )
}

export default Register