import { useUpdateCartQuantity, useRemoveCartItem } from "../../hooks/useCart";

const CartItem = ({ id, productImage, productName, unitPrice, quantity, lineTotal }) => {
  const { mutate: updateQuantity } = useUpdateCartQuantity();
  const { mutate: removeItem } = useRemoveCartItem();

  const handleDecrease = () => {
    if (quantity <= 1) return;
    updateQuantity({ id, quantity: quantity - 1 });
  };

  const handleIncrease = () => updateQuantity({ id, quantity: quantity + 1 });

  return (
    <div className="border-b border-border py-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="w-20 h-20 flex-shrink-0">
          <img src={productImage} alt={productName} className="w-full h-full object-cover rounded-(--radius-control)" />
        </div>

        <div className="flex-1 min-w-[150px]">
          <p className="text-sm font-medium text-ink">{productName}</p>
          <p className="text-sm text-ink-muted">Kshs. {unitPrice} each</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-2 py-1 text-sm bg-surface-muted rounded hover:bg-border"
            onClick={handleDecrease}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-sm">{quantity}</span>
          <button
            className="px-2 py-1 text-sm bg-surface-muted rounded hover:bg-border"
            onClick={handleIncrease}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-ink">Kshs. {lineTotal}</p>
          <button
            className="text-red-500 text-xl hover:text-red-700"
            onClick={() => removeItem(id)}
            aria-label="Remove item"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
