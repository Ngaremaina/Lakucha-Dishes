import React, { useState } from "react";

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
        const value = event.target.value
        const id = event.target.id
        setUser(prev => {return {...prev, [id]:value}})
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" id="email" value={user.email} aria-describedby="emailHelp" onChange={handleChange}/>

                <label className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={user.password} onChange={handleChange}/>

                <button type="submit" class="btn btn-primary">Submit</button>

            </div>
            
        </form>
    )

}

export default Login