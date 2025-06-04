import React, { useState } from "react";
import { addShipping } from "../services/Products";
import { useNavigate } from "react-router-dom";
import SubmitButton from "../components/button/SubmitButton";

const Checkout = () => {
  const [shipping, setShipping] = useState({
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    region: "",
  });

  const navigate = useNavigate()

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        const response = await addShipping(shipping);
        if (response){
            navigate('/payment')
          }
      } finally {
        setLoading(false);
      }
    };



  const handleChange = (event) => {
    const { id, value } = event.target;
    setShipping((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex justify-center p-4 bg-gray-100 min-h-screen">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-800 text-white px-6 py-4">
          <h4 className="text-xl font-semibold">Shipping Address</h4>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                  First name
                </label>
                <input
                  type="text"
                  id="firstname"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                  value={shipping.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastname"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                  value={shipping.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234 Main St"
                value={shipping.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  id="region"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={shipping.region}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option>Nairobi</option>
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  id="city"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={shipping.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option>Utawala</option>
                  <option>Westlands</option>
                  <option>Karen</option>
                  <option>Lang'ata</option>
                  <option>South B</option>
                  <option>South C</option>
                  <option>Eastleigh</option>
                  <option>Embakasi</option>
                  <option>Donholm</option>
                  <option>Buruburu</option>
                  <option>Kasarani</option>
                  <option>Roysambu</option>
                  <option>Thika</option>
                  <option>Ruiru</option>
                  <option>Syokimau</option>
                  <option>Kitengela</option>
                  <option>Athi River</option>
                  <option>Ngong</option>
                  <option>Ruaka</option>
                </select>
              </div>

            </div>

            <hr className="my-4" />

            <SubmitButton text="Save" loading = {loading}/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
