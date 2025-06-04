import { useState } from 'react';
import { handleAddtoCart } from '../../services/Cart';
import { useGlobal } from '../../context/GlobalContext';

const AddToCartButton = ({ name, price, description, image, quantity, total, adminId }) => {
  const [loading, setLoading] = useState(false);
  const { fetchCart } = useGlobal();

  const handleClick = async () => {
    setLoading(true);
    try {
      await handleAddtoCart(name, price, description, image, quantity, total, adminId, fetchCart);
    } catch (error) {
      console.error("Add to cart failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`flex justify-center items-center rounded-md w-full mt-6 bg-cyan-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg cursor-pointer focus:bg-cyan-700 focus:shadow-none active:bg-cyan-700 hover:bg-cyan-700 active:shadow-none ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      ) : (
        'Add to cart'
      )}
    </button>
  );
};

export default AddToCartButton;
