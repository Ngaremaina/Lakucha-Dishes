import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Analytics } from "@vercel/analytics/react"
import NavBar from "../components/header/NavBar"
import Footer from "../components/footer/Footer"
import Loader from "../components/loader/Loader"
import Menu from "../pages/Menu"
import DetailsPage from "../pages/DetailsPage"
import Contact from "../pages/Contact"
import Cart from "../pages/Cart"
import About from "../pages/About"
import Checkout from "../pages/Checkout"
import Payment from "../pages/Payment"
import OrderHistory from "../pages/OrderHistory"
import Login from "../pages/Login"
import Register from "../pages/Register"
import RequireAuth from "./RequireAuth"
import RequireAdmin from "./RequireAdmin"
import AdminLayout from "../pages/admin/AdminLayout"
import AdminProducts from "../pages/admin/AdminProducts"
import AdminCategories from "../pages/admin/AdminCategories"
import AdminOrders from "../pages/admin/AdminOrders"
import AdminContacts from "../pages/admin/AdminContacts"
import { useAuthSession } from "../hooks/useAuthSession"

const AppShell = () => (
  <div className="min-h-screen flex flex-col">
    <NavBar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default function AppRoutes() {
  const status = useAuthSession();

  if (status !== 'ready') return <Loader />;

  return (
    <>
      <Analytics />
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />

        <Route element={<AppShell />}>
          <Route path="/" element={<Menu />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/products/:id" element={<DetailsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route element={<RequireAuth />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment/:orderId" element={<Payment />} />
            <Route path="/orders" element={<OrderHistory />} />
          </Route>

          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="products" replace />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="contact" element={<AdminContacts />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
