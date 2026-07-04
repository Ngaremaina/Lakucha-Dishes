import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input, { Label, FieldError } from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useOrder } from "../hooks/useOrders";
import { useInitiateStkPush, usePaymentStatus } from "../hooks/usePayments";

const schema = z.object({
  phone: z.string().regex(/^[71]\d{8}$/, "Enter a valid Safaricom number, e.g. 712345678"),
});

const Payment = () => {
  const { orderId } = useParams();
  const [pushed, setPushed] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { data: order } = useOrder(orderId);
  const { mutateAsync: initiateStkPush } = useInitiateStkPush();
  const { data: payment } = usePaymentStatus(orderId, { enabled: pushed });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ phone }) => {
    setServerError(null);
    try {
      await initiateStkPush({ orderId, phoneNumber: `254${phone}` });
      setPushed(true);
    } catch (error) {
      setServerError(error.response?.data?.message ?? "Could not start the M-Pesa payment");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="bg-surface-muted px-6 py-4">
          <h4 className="text-xl font-semibold text-ink">M-Pesa Payment</h4>
        </div>

        <div className="px-6 py-6">
          <h4 className="text-center text-lg font-medium text-ink mb-4">Order Summary</h4>
          {order && (
            <table className="w-full text-left border-collapse mb-6 text-ink">
              <thead>
                <tr>
                  <th className="py-2">Items</th>
                  <th className="py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="py-2">{order.items.reduce((acc, i) => acc + i.quantity, 0)}</td>
                  <td className="py-2 font-semibold">Kshs. {order.total}</td>
                </tr>
              </tbody>
            </table>
          )}

          {pushed ? (
            <div className="text-center space-y-3">
              <p className="text-ink">Check your phone and enter your M-Pesa PIN to complete payment.</p>
              {payment && <Badge status={payment.status === 'SUCCESS' ? 'PAID' : payment.status === 'FAILED' ? 'CANCELLED' : 'PENDING_PAYMENT'} />}
              {payment?.status === 'FAILED' && payment.resultDesc && (
                <p className="text-sm text-red-600">{payment.resultDesc}</p>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-ink-muted">+254</span>
                  <Input id="phone" placeholder="712345678" {...register("phone")} error={!!errors.phone} />
                </div>
                <FieldError>{errors.phone?.message}</FieldError>
              </div>
              {serverError && <FieldError>{serverError}</FieldError>}
              <Button type="submit" loading={isSubmitting} className="w-full">Pay</Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Payment;
