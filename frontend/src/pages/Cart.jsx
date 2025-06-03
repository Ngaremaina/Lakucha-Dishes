import { useState } from "react";
import CartItem from "../components/cards/CartItem";
import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

const Cart = () => {
  const { cartItems } = useGlobal();  
  const grandTotal = cartItems?.reduce((acc, item) => acc + (item.total || 0), 0);
  const totalPrice = grandTotal + 250;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="md:w-2/3 bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-xl font-bold mb-2">Shopping Cart</h4>
            <p className="text-gray-500">{cartItems?.length} items</p>
          </div>
          {cartItems?.length > 0 ? (
            cartItems?.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                image={item.image}
                description={item.description}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
                total={item.total}
              />
            ))
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
          <Link to="/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to shop
          </Link>
        </div>

        {/* Summary */}
        <div className="md:w-1/3 bg-white shadow rounded-lg p-6">
          <h5 className="text-lg font-bold mb-4">Summary</h5>
          <hr className="mb-4" />
          <div className="flex justify-between mb-2">
            <span>ITEMS</span>
            <span className="text-gray-700">Kshs. {grandTotal}</span>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Shipping</label>
            <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option>Standard Delivery - Kshs. 250</option>
            </select>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-4 mb-6">
            <span className="font-semibold">Total Price</span>
            <span className="font-semibold">Kshs. {totalPrice}</span>
          </div>
          <Link
            to="/checkout"
            className="w-full block bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
