import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input, { Label, FieldError } from "../components/ui/Input";
import Button from "../components/ui/Button";
import { loginUser } from "../services/auth";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email, password }) => {
    setServerError(null);
    try {
      const { accessToken, user } = await loginUser(email, password);
      setAuth(accessToken, user);
      navigate("/");
    } catch {
      setServerError("Invalid email or password");
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <div className="grid md:grid-cols-2 items-center gap-6 max-w-4xl w-full p-6 shadow-(--shadow-elevated) rounded-(--radius-card) bg-surface">
        <div className="w-full">
          <h1 className="text-2xl mb-6 text-center font-bold text-ink">Login</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="johndoe@example.com" {...register("email")} error={!!errors.email} />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" {...register("password")} error={!!errors.password} />
              <FieldError>{errors.password?.message}</FieldError>
            </div>
            {serverError && <FieldError>{serverError}</FieldError>}
            <p className="text-sm text-ink-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="text-brand-600 underline">Register here</Link>
            </p>
            <Button type="submit" loading={isSubmitting} className="w-full">Login</Button>
          </form>
        </div>
        <img
          src="https://cdn.pixabay.com/photo/2024/09/12/06/02/ai-generated-9041388_640.jpg"
          className="hidden md:block w-full h-full object-cover rounded-(--radius-card)"
          alt=""
        />
      </div>
    </div>
  );
};

export default Login;
