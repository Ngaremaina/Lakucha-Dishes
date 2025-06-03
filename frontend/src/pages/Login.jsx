import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authentication";
import InputField from "../components/form/InputField";
import SubmitButton from "../components/button/SubmitButton";
import FormTemplate from "../components/form/FormTemplate";

const Login = () => {
    const [user, setUser] = useState({
        email:"",
        password:""
    })
    
    const { loginUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

   const handleSubmit = async (event) => {
      event.preventDefault();
      setLoading(true);
      
      try {
        const response = await loginUser(user.email, user.password);
        if (response) {
          navigate("/dashboard"); // ✅ navigate after successful login
        }
      } catch (error) {
        console.error('Incorrect email/password', error.response?.data || error.message);
        // Optionally show error to user
      } finally {
        setLoading(false);
      }
    };

    const handleChange = (event) => {
        const input = event.target.name
        const value = event.target.value
        setUser(prev => {return {...prev, [input]: value}})
    }

    return(
        <div className="w-full overflow-x-hidden lg:h-screen overflow-y-hidden flex items-center justify-center font-[sans-serif] md:h-full">
          <div className="grid md:grid-cols-2 items-center gap-4 max-md:gap-6 max-w-6xl max-md:max-w-lg w-full p-4 m-4 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-md bg-white">
            <div className="md:max-w-md w-full px-4">
              <FormTemplate handleSubmit={handleSubmit} heading="Login User">
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
                    Don't have an account?
                    <Link to="/signup" className="text-decoration-underline text-info">
                      Click here to Register
                    </Link>
                  </p>
                </>
                <SubmitButton text="Login" loading = {loading}/>
              </FormTemplate>
            </div>

            {/* Image - RIGHT */}
            <div className="md:h-full h-64 bg-[#000842] rounded-xl lg:p-12 p-4 flex items-center justify-center">
              <img
                src="https://readymadeui.com/signin-image.webp"
                className="w-full h-full object-contain"
                alt="login"
              />
            </div>
          </div>
        </div>

    )

}

export default Login