import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/Authentication";
import { useState } from "react";
import { ShoppingCartIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

const NavBar = ({ fetchCategory, fetchProducts }) => {
  const { logout, admin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-2">
        <div className="flex justify-between h-16 items-center">

          {/* Brand */}
          <div className="flex-shrink-0">
            <NavLink to="/" onClick={() => fetchProducts()} className="text-xl font-bold text-white">
              Lakucha Dishes
            </NavLink>
          </div>

          {/* Hamburger Button */}
          <div className="flex md:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"
                viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/dashboard" onClick={() => fetchProducts()} className="text-white hover:text-gray-300 cursor-pointer">Home</NavLink>

            <div className="relative text-white">
              <button onClick={() => setMenuOpen(!menuOpen)} className="hover:text-gray-300 cursor-pointer">
                Menu
              </button>
              {menuOpen && (
                <div className="absolute mt-2 text-white w-48 bg-gray-400 rounded shadow-lg py-2 z-20">
                  <Link to="/menu" onClick={() => fetchCategory("Breakfast")} className="block px-4 py-2 hover:bg-gray-600">Breakfast</Link>
                  <Link to="/menu" onClick={() => fetchCategory("Lunch")} className="block px-4 py-2 hover:bg-gray-600">Lunch</Link>
                  <Link to="/menu" onClick={() => fetchCategory("Dinner")} className="block px-4 py-2 hover:bg-gray-600">Dinner</Link>
                </div>
              )}
            </div>

            <Link to="/about us" className="text-white hover:text-gray-300">About Us</Link>
            <Link to="/contact us" className="hover:text-gray-300">Contact Us</Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <span>{admin?.username}</span>
            <NavLink to="/cart" className="hover:text-gray-300">
              <ShoppingCartIcon className="h-5 w-5 text-white"/>
            </NavLink>
            <button onClick={logout} className="hover:text-gray-300">
              <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-700 px-4 pt-4 pb-2 space-y-2">
          <NavLink to="/dashboard" onClick={() => { fetchProducts(); setMobileOpen(false); }} className="text-white block hover:text-gray-300">Home</NavLink>
          <details className="group">
            <summary className="cursor-pointer hover:text-gray-300">Menu</summary>
            <div className="ml-4 mt-2 space-y-1">
              <Link to="/menu" onClick={() => fetchCategory("Breakfast")} className="block hover:text-gray-300">Breakfast</Link>
              <Link to="/menu" onClick={() => fetchCategory("Lunch")} className="block hover:text-gray-300">Lunch</Link>
              <Link to="/menu" onClick={() => fetchCategory("Dinner")} className="block hover:text-gray-300">Dinner</Link>
            </div>
          </details>
          <Link to="/about us" onClick={() => setMobileOpen(false)} className="text-white hover:text-gray-300 block hover:text-gray-300">About Us</Link>
          <Link to="/contact us" onClick={() => setMobileOpen(false)} className="block hover:text-gray-300">Contact Us</Link>

          <hr className="my-2 border-gray-600" />

          <span className="block text-gray-400">{admin?.username}</span>
          <NavLink to="/cart" onClick={() => setMobileOpen(false)} className="block hover:text-gray-300">
            <ShoppingCartIcon className="h-5 w-5 text-white"/>
          </NavLink>
          <button onClick={() => { logout(); setMobileOpen(false); }} className="block w-full text-left hover:text-gray-300 cursor-pointer">
            <ArrowLeftStartOnRectangleIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
