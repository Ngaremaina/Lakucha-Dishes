import { useState } from 'react';
import { handleAddtoCart } from '../../services/Cart';

const AddToCartButton = ({ name, price, description, image, quantity, total, adminId }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await handleAddtoCart(name, price, description, image, quantity, total, adminId);
    } catch (error) {
      console.error("Add to cart failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`flex items-center justify-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
        loading ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      onClick={handleClick}
      disabled={loading}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
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
      )}
      {loading ? 'Adding...' : 'Add to cart'}
    </button>
  );
};

export default AddToCartButton;
