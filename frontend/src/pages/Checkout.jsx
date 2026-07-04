import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input, { Label, FieldError } from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useCreateShipping } from "../hooks/useShipping";
import { useCheckout } from "../hooks/useOrders";

const NAIROBI_AREAS = [
  "Utawala", "Westlands", "Karen", "Lang'ata", "South B", "South C",
  "Eastleigh", "Embakasi", "Donholm", "Buruburu", "Kasarani", "Roysambu",
  "Thika", "Ruiru", "Syokimau", "Kitengela", "Athi River", "Ngong", "Ruaka",
];

const schema = z.object({
  firstname: z.string().min(1, "Required"),
  lastname: z.string().min(1, "Required"),
  region: z.string().min(1, "Choose a region"),
  city: z.string().min(1, "Choose a city"),
  address: z.string().min(1, "Required"),
});

const Checkout = () => {
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const { mutateAsync: createShipping } = useCreateShipping();
  const { mutateAsync: checkout } = useCheckout();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError(null);
    try {
      const shipping = await createShipping(values);
      const order = await checkout(shipping.id);
      navigate(`/payment/${order.id}`);
    } catch (error) {
      setServerError(error.response?.data?.message ?? "Could not place your order");
    }
  };

  return (
    <div className="flex justify-center p-4 bg-surface-muted min-h-screen">
      <Card className="w-full max-w-2xl overflow-hidden">
        <div className="bg-ink text-white px-6 py-4">
          <h4 className="text-xl font-semibold">Shipping Address</h4>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname">First name</Label>
                <Input id="firstname" placeholder="John" {...register("firstname")} error={!!errors.firstname} />
                <FieldError>{errors.firstname?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="lastname">Last name</Label>
                <Input id="lastname" placeholder="Doe" {...register("lastname")} error={!!errors.lastname} />
                <FieldError>{errors.lastname?.message}</FieldError>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="1234 Main St" {...register("address")} error={!!errors.address} />
              <FieldError>{errors.address?.message}</FieldError>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="region">Region</Label>
                <select
                  id="region"
                  className="w-full rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-sm"
                  {...register("region")}
                >
                  <option value="">Choose...</option>
                  <option>Nairobi</option>
                </select>
                <FieldError>{errors.region?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <select
                  id="city"
                  className="w-full rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-sm"
                  {...register("city")}
                >
                  <option value="">Choose...</option>
                  {NAIROBI_AREAS.map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
                <FieldError>{errors.city?.message}</FieldError>
              </div>
            </div>

            {serverError && <FieldError>{serverError}</FieldError>}

            <hr className="border-border" />

            <Button type="submit" loading={isSubmitting} className="w-full">Save &amp; continue</Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
