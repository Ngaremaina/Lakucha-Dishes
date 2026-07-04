import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import FoodItem from "../components/cards/FoodItem";
import Skeleton from "../components/ui/Skeleton";
import { getProducts } from "../services/products";
import { CATALOG_STALE_TIME } from "../lib/queryClient";

// Backend doesn't support server-side category filtering yet, so this pulls
// a large page and filters client-side — fine for a small catalog.
const Menu = () => {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', { page: 0, size: 100 }],
    queryFn: () => getProducts({ page: 0, size: 100 }),
    staleTime: CATALOG_STALE_TIME,
  });

  const products = categoryId
    ? data?.content.filter((product) => String(product.categoryId) === categoryId)
    : data?.content;

  if (isError) {
    return <p className="text-center text-red-600 py-8">Could not load the menu. Please try again.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <FoodItem key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-muted py-8">No dishes found.</p>
      )}
    </div>
  );
};

export default Menu;
