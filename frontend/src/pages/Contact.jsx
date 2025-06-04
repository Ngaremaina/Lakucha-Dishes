import React, { useState } from "react";
import { contactUser } from "../services/User";
import SubmitButton from "../components/button/SubmitButton";

const Contact = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        await contactUser(user);
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-center mb-4">Contact Us</h1>
      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="John Doe"
            value={user.username}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="johndoe@example.com"
            value={user.email}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            name="message"
            id="message"
            placeholder="Type your message"
            value={user.message}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <SubmitButton text="Submit" loading = {loading}/>
      </form>
    </div>
  );
};

export default Contact;
