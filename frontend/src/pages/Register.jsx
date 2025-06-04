import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormTemplate from "../components/form/FormTemplate";
import InputField from "../components/form/InputField";
import SubmitButton from "../components/button/SubmitButton";
import { registerUser } from "../services/User";

const Register = () => {
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

    const handleSubmit = async (event) => {
        event.preventDefault()
        const response = await registerUser(user)
        if (response){
            navigate("/signin")
        }

    }
    return(
        <div className="w-full overflow-x-hidden lg:h-screen overflow-y-hidden flex items-center justify-center font-[sans-serif] md:h-full">
            <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-6 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md bg-white">
            <div className="md:max-w-md w-full px-4">
                <FormTemplate onSubmit={handleSubmit} heading="Register User">
                <InputField
                    type="text"
                    placeholder="johndoe"
                    name="username"
                    label="Username"
                    onChange={handleChange}
                    value={user.username}
                />
                <InputField
                    type="email"
                    placeholder="johndoe@example.com"
                    name="email"
                    label="Email Address"
                    onChange={handleChange}
                    value={user.email}
                />
                <InputField
                    label="Password"
                    type="password"
                    placeholder="********"
                    name="password"
                    onChange={handleChange}
                    value={user.password}
                />
                <>
                    <p>
                    Already have an account? <nbsp></nbsp>
                    <Link to="/signin" className="text-blue-700 underline-offset-2">
                        Click here to Sign In
                    </Link>
                    </p>
                </>
                <SubmitButton text="Register"/>
                </FormTemplate>
            </div>

            {/* Image - RIGHT */}
            <div className="h-full h-full rounded-xl flex items-center justify-center">
                <img
                src="https://cdn.pixabay.com/photo/2024/09/12/06/02/ai-generated-9041388_640.jpg"
                className="w-full h-full object-contain rounded-xl"
                alt="login"
                />
            </div>
            </div>
        </div>
    )
}

export default Register