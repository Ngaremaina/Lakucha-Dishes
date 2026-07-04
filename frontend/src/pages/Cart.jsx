import { Link } from "react-router-dom";
import CartItem from "../components/cards/CartItem";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import { useCart } from "../hooks/useCart";

const SHIPPING_FEE = 250;

const Cart = () => {
  const { data: cartItems, isLoading } = useCart();
  const grandTotal = cartItems?.reduce((acc, item) => acc + item.lineTotal, 0) ?? 0;
  const totalPrice = grandTotal + SHIPPING_FEE;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="md:w-2/3 p-6">
          <div className="mb-4">
            <h4 className="text-xl font-bold text-ink mb-2">Shopping Cart</h4>
            <p className="text-ink-muted">{cartItems?.length ?? 0} items</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : cartItems?.length > 0 ? (
            cartItems.map((item) => <CartItem key={item.id} {...item} />)
          ) : (
            <p className="text-ink-muted">Your cart is empty.</p>
          )}

          <Link to="/menu" className="mt-4 inline-block text-brand-600 hover:underline">
            ← Back to shop
          </Link>
        </Card>

        <Card className="md:w-1/3 p-6 h-fit">
          <h5 className="text-lg font-bold text-ink mb-4">Summary</h5>
          <hr className="mb-4 border-border" />
          <div className="flex justify-between mb-2 text-ink">
            <span>ITEMS</span>
            <span>Kshs. {grandTotal}</span>
          </div>
          <div className="flex justify-between mb-2 text-ink-muted text-sm">
            <span>Shipping</span>
            <span>Kshs. {SHIPPING_FEE}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-4 mb-6 font-semibold text-ink">
            <span>Total Price</span>
            <span>Kshs. {totalPrice}</span>
          </div>
          {cartItems?.length ? (
            <Link
              to="/checkout"
              className="block w-full text-center rounded-(--radius-control) bg-brand-600 text-white py-2.5 text-sm font-semibold hover:bg-brand-700"
            >
              Checkout
            </Link>
          ) : (
            <Button disabled className="w-full">Checkout</Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Cart;
