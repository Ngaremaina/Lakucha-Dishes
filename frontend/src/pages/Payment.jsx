import React, { useEffect, useState } from "react";
import { addPayment } from "../services/Products";
import { useGlobal } from "../context/GlobalContext";
import SubmitButton from "../components/button/SubmitButton"

const Payment = () => {
  const [phone, setPhone] = useState("");
  const { cartItems } = useGlobal()
  const [loading, setLoading] = useState(false);

  const allPrices = cartItems?.map(item => item.total);
  const allItems = cartItems?.map(item => item.quantity);

  const totalItems = allItems.reduce((acc, curr) => acc + curr, 0);
  const subtotal = allPrices.reduce((acc, curr) => acc + curr, 0);
  const shipping = 250;
  const totalPrice = subtotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addPayment(phone, totalPrice);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-100 px-6 py-4">
          <h4 className="text-xl font-semibold text-gray-800">MPESA Payment</h4>
        </div>

        <div className="px-6 py-4">
          <h4 className="text-center text-lg font-medium mb-4">Order Summary</h4>
          <table className="w-full text-left border-collapse mb-6">
            <thead>
              <tr>
                <th className="py-2">Items</th>
                <th className="py-2">Shipping</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2">{totalItems}</td>
                <td className="py-2">{shipping}</td>
                <td className="py-2 font-semibold">{totalPrice}</td>
              </tr>
            </tbody>
          </table>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-end gap-4">
              <div className="w-2/3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  id="phone"
                  placeholder="712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <SubmitButton text="Pay" loading = {loading}/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;
