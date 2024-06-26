import React, { useState } from "react";

const Contact = () => {
    const [user, setUser] = useState({
        username:"",
        email:"",
        message:""
    })
    const handleChange = (event) => {
        const input = event.target.name
        const value = event.target.value
        setUser(prev => {return {...prev, [input]:value}})
    }

    const contactUser = (user) => {
        fetch("/contact",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(user)
        })
        .then(response => {
          if (response.status === 200){
            console.log("success")
          }
        })
      }
    const handleSubmit = (event) => {
        event.preventDefault()
        contactUser(user)
    }
    return(
        <div className="container my-3 py-3">
            <h1 className="text-center">Contact Us</h1>
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
                            <div className="form my-3">   
                                <label>Message</label>
                                <textarea type="text" className="form-control" id="Message" placeholder="Type your message" onChange={handleChange} name="message" value={user.message} rows={3}></textarea>
                            </div>
                            
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit">Submit</button>
                            </div>
                           
                        </form>
                    </div>
                </div>
            </div>
    )
}

export default Contact