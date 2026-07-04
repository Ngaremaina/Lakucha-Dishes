import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ShoppingCartIcon, ArrowLeftStartOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from "../../store/authStore";
import { useCategories } from "../../hooks/useCategories";
import { logoutUser } from "../../services/auth";

const NavBar = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clear);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: categories } = useCategories();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();
      navigate("/signin");
    }
  };

  return (
    <nav className="bg-brand-600 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-2">
        <div className="flex justify-between h-16 items-center">

          <div className="flex-shrink-0">
            <NavLink to="/" className="text-xl font-bold text-white">
              Lakucha Dishes
            </NavLink>
          </div>

          <div className="flex md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/" className="text-white hover:text-brand-100">Home</NavLink>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1 text-white hover:text-brand-100 outline-none">
                Menu <ChevronDownIcon className="h-4 w-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  sideOffset={8}
                  className="min-w-[10rem] rounded-(--radius-card) bg-surface text-ink shadow-(--shadow-elevated) py-2 z-20"
                >
                  {categories?.length ? (
                    categories.map((category) => (
                      <DropdownMenu.Item key={category.id} asChild>
                        <Link to={`/menu?category=${category.id}`} className="block px-4 py-2 text-sm hover:bg-surface-muted outline-none">
                          {category.name}
                        </Link>
                      </DropdownMenu.Item>
                    ))
                  ) : (
                    <DropdownMenu.Item asChild>
                      <Link to="/menu" className="block px-4 py-2 text-sm hover:bg-surface-muted outline-none">
                        All items
                      </Link>
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <Link to="/about" className="text-white hover:text-brand-100">About Us</Link>
            <Link to="/contact" className="text-white hover:text-brand-100">Contact Us</Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {user && <span className="text-sm">{user.username}</span>}
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin" className="hover:text-brand-100 text-sm">Admin</NavLink>
            )}
            <NavLink to="/orders" className="hover:text-brand-100 text-sm">Orders</NavLink>
            <NavLink to="/cart" className="hover:text-brand-100">
              <ShoppingCartIcon className="h-5 w-5 text-white" />
            </NavLink>
            <button onClick={handleLogout} aria-label="Log out" className="hover:text-brand-100">
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-brand-700 px-4 pt-4 pb-4 space-y-2">
          <NavLink to="/" onClick={() => setMobileOpen(false)} className="text-white block">Home</NavLink>
          <details className="group">
            <summary className="cursor-pointer">Menu</summary>
            <div className="ml-4 mt-2 space-y-1">
              {categories?.map((category) => (
                <Link
                  key={category.id}
                  to={`/menu?category=${category.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="block hover:text-brand-100"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </details>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="text-white block">About Us</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-white block">Contact Us</Link>
          <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-white block">Orders</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-white block">Admin</Link>
          )}

          <hr className="my-2 border-white/20" />

          {user && <span className="block text-white/70">{user.username}</span>}
          <Link to="/cart" onClick={() => setMobileOpen(false)} className="block">
            <ShoppingCartIcon className="h-5 w-5 text-white" />
          </Link>
          <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left">
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
