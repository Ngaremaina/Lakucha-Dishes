import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input, { Label, FieldError } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { sendContactMessage } from "../services/contact";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(1, "Required"),
});

const Contact = () => {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    await sendContactMessage(values);
    setSent(true);
    reset();
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-center text-ink mb-4">Contact Us</h1>
      <hr className="mb-6 border-border" />

      {sent && (
        <p className="text-center text-green-700 mb-4">Thanks — we'll get back to you soon.</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md mx-auto">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" {...register("name")} error={!!errors.name} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" placeholder="johndoe@example.com" {...register("email")} error={!!errors.email} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <textarea
            id="message"
            placeholder="Type your message"
            rows={4}
            {...register("message")}
            className="w-full rounded-(--radius-control) border border-border bg-surface px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <FieldError>{errors.message?.message}</FieldError>
        </div>

        <Button type="submit" loading={isSubmitting} className="w-full">Submit</Button>
      </form>
    </div>
  );
};

export default Contact;
