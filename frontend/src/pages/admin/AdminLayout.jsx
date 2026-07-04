import { NavLink, Outlet } from "react-router-dom";
import clsx from "clsx";

const TABS = [
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/contact", label: "Contact messages" },
];

const AdminLayout = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-bold text-ink mb-6">Admin</h1>
    <nav className="flex gap-2 border-b border-border mb-6">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            clsx(
              'px-3 py-2 text-sm font-medium border-b-2 -mb-px',
              isActive
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-ink-muted hover:text-ink'
            )
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
    <Outlet />
  </div>
);

export default AdminLayout;
