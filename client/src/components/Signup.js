import React, { useState } from "react";
const Signup = ({signUpUser}) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        signUpUser(user)
        
    }
    const handleChange = (event) =>{
        const value = event.target.value
        const id = event.target.id
        setUser(prev => {return {...prev, [id]:value}})
    }
   
    return(
        <form onSubmit={handleSubmit}>
            <h3 className="mb-3 d-flex justify-content-center">Signup</h3>
            <div className="mb-3">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" id="firstName" value={user.firstName} aria-describedby="nameHelp" onChange={handleChange}/>
                
            </div>
            <div className="mb-3">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" id="lastName" aria-describedby="emailHelp" onChange={handleChange}/>
                
            </div>
            <div className="mb-3">
                <label  className="form-label">Email Address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={handleChange}/>
             
            </div>
            <div className="mb-3">
                <label  className="form-label">Password</label>
                <input type="password" className="form-control" id="password" onChange={handleChange}/>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
    )

}

export default Signup