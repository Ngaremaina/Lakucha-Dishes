import { useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProducts";
import AddToCartButton from "../components/button/AddToCartButton";
import Skeleton from "../components/ui/Skeleton";

const DetailsPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, isError } = useProduct(id);

  if (isLoading) {
    return (
      <div className="container mx-auto my-8 px-4 flex flex-col lg:flex-row gap-8">
        <Skeleton className="w-full lg:w-1/2 h-96" />
        <Skeleton className="w-full lg:w-1/2 h-96" />
      </div>
    );
  }

  if (isError || !product) {
    return <p className="text-center text-red-600 py-8">Product not found.</p>;
  }

  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md h-auto object-cover rounded-(--radius-card) shadow-(--shadow-card)"
          />
        </div>

        <div className="w-full lg:w-1/2 flex flex-col justify-center py-4">
          {product.categoryName && (
            <h4 className="text-sm uppercase text-ink-muted mb-2">{product.categoryName}</h4>
          )}
          <h1 className="text-3xl font-bold text-ink mb-4">{product.name}</h1>
          <h3 className="text-2xl font-semibold text-brand-600 mb-2">Kshs. {product.price}</h3>
          {product.ratingCount > 0 && (
            <p className="text-sm text-ink-muted mb-4">
              ★ {product.averageRating.toFixed(1)} ({product.ratingCount} ratings)
            </p>
          )}
          <p className="text-ink-muted leading-relaxed mb-6">{product.description}</p>
          <AddToCartButton productId={product.id} className="w-full sm:w-64" />
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
