import { useState } from "react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import { useToast } from "../../components/ui/Toast";
import { useAdminOrders, useUpdateOrderStatus } from "../../hooks/useAdminOrders";

const STATUSES = ["PENDING_PAYMENT", "PAID", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];

const AdminOrders = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const { data: page, isLoading } = useAdminOrders({ status: statusFilter || undefined });
  const updateStatus = useUpdateOrderStatus();
  const toast = useToast();

  const handleStatusChange = async (order, status) => {
    try {
      await updateStatus.mutateAsync({ id: order.id, status });
      toast({ title: `Order #${order.id} marked ${status.replaceAll("_", " ")}` });
    } catch (error) {
      toast({ title: "Failed to update order status", description: error.response?.data?.message, variant: "error" });
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-(--radius-control) border border-border bg-surface px-3.5 py-2 text-sm text-ink"
        >
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-border">
          {page?.content?.length ? (
            page.content.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-4 py-3 gap-4">
                <div>
                  <p className="text-ink font-medium">Order #{order.id}</p>
                  <p className="text-sm text-ink-muted">
                    {new Date(order.createdAt).toLocaleString()} · {order.items.length} item(s) · Kshs. {order.total}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={order.status} />
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    disabled={updateStatus.isPending}
                    className="rounded-(--radius-control) border border-border bg-surface px-2.5 py-1.5 text-sm text-ink"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-6 text-ink-muted">No orders found.</p>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminOrders;
