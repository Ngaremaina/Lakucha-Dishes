import { Link } from "react-router-dom";
import Card from "../ui/Card";
import AddToCartButton from "../button/AddToCartButton";

const FoodItem = ({ id, image, name, price, description, averageRating }) => (
  <Card className="flex flex-col my-3 w-full">
    <Link to={`/products/${id}`} className="block">
      <div className="p-2.5 h-56 overflow-hidden">
        <img src={image} alt={name} className="h-full w-full object-cover rounded-(--radius-control)" />
      </div>
      <div className="px-4 pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-ink text-lg font-semibold">{name}</p>
          <p className="text-brand-600 text-lg font-semibold whitespace-nowrap">Kshs. {price}</p>
        </div>
        {averageRating > 0 && (
          <p className="text-sm text-ink-muted mb-1">★ {averageRating.toFixed(1)}</p>
        )}
        <p className="text-ink-muted leading-normal font-light">
          {description?.length > 60 ? `${description.substring(0, 60)}...` : description}
        </p>
      </div>
    </Link>
    <div className="px-4 pb-4">
      <AddToCartButton productId={id} />
    </div>
  </Card>
);

export default FoodItem;
