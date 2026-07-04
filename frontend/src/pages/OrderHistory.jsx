import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import { useOrders } from "../hooks/useOrders";

const OrderHistory = () => {
  const { data: orders, isLoading } = useOrders();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">Your Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      ) : orders?.length ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-ink">Order #{order.id}</p>
                <Badge status={order.status} />
              </div>
              <p className="text-sm text-ink-muted mb-3">
                {new Date(order.createdAt).toLocaleString()} · {order.items.length} item(s)
              </p>
              <div className="flex items-center justify-between">
                <p className="text-ink font-medium">Kshs. {order.total}</p>
                {order.status === 'PENDING_PAYMENT' && (
                  <Link to={`/payment/${order.id}`} className="text-brand-600 text-sm hover:underline">
                    Complete payment
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-ink-muted">You haven't placed any orders yet.</p>
      )}
    </div>
  );
};

export default OrderHistory;
