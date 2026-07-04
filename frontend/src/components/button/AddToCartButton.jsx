import { useAddToCart } from "../../hooks/useCart";
import { useToast } from "../ui/Toast";
import Button from "../ui/Button";

const AddToCartButton = ({ productId, className }) => {
  const { mutate, isPending } = useAddToCart();
  const toast = useToast();

  const handleClick = () => {
    mutate(
      { productId, quantity: 1 },
      {
        onSuccess: () => toast({ title: "Added to cart" }),
        onError: () => toast({ title: "Could not add to cart", variant: "error" }),
      }
    );
  };

  return (
    <Button onClick={handleClick} loading={isPending} className={className ?? "w-full mt-4"}>
      Add to cart
    </Button>
  );
};

export default AddToCartButton;
