import { updateCart, handleDelete, getCartItems } from "../../services/Cart";
import { useAuth } from "../../context/Authentication"
import { useGlobal } from "../../context/GlobalContext";

const CartItem = ({ id, image, description, price, name, quantity, total }) => {
  const { admin } = useAuth()
  const { fetchCart } = useGlobal()
  
  const handleDecrease = () => {
    const newQuantity = quantity <= 1 ? 1 : quantity - 1;
    const newTotal = newQuantity * price;
    updateCart(id, name, price, description, image, newTotal, newQuantity, admin.id, fetchCart);

  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    const newTotal = newQuantity * price;
    updateCart(id, name, price, description, image, newTotal, newQuantity, admin.id, fetchCart);
  };

  return (
    <div className="border-t border-b py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Product Image */}
        <div className="w-20 h-20 flex-shrink-0">
          <img src={image} alt={name} className="w-full h-full object-cover rounded" />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-[150px]">
          <p className="text-sm text-gray-500">{name}</p>
          <p className="text-sm text-gray-700">{description.substring(0, 50)}...</p>
        </div>

        {/* Quantity Control */}
        <div className="flex items-center gap-3">
          <button
            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={handleDecrease}
          >
            -
          </button>
          <span className="text-sm">{quantity}</span>
          <button
            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={handleIncrease}
          >
            +
          </button>
        </div>

        {/* Price & Delete */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">Kshs. {total}</p>
          <button
            className="text-red-500 text-xl hover:text-red-700 cursor-pointer"
            onClick={() => handleDelete(id, fetchCart)}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
