import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ fetchCategory }) => {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 md:px-12 mt-6 border-t border-gray-700">
      <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

        {/* Brand */}
        <div>
          <h5 className="text-yellow-300 text-lg font-semibold uppercase mb-2">Lakucha Dishes</h5>
          <p className="text-sm">
            Join us on a mouthwatering journey filled with tantalizing recipes,
            expert cooking tips, and a feast for your senses.
          </p>
        </div>

        {/* Contacts */}
        <div>
          <h5 className="text-yellow-300 text-lg font-semibold uppercase mb-2">Contacts</h5>
          <ul className="space-y-1 text-sm">
            <li>Utawala, Nairobi</li>
            <li>Tel: +25478945612</li>
            <li>
              <Link to="mailto:lakuchadishes@gmail.com" className="hover:text-yellow-300 inline-flex items-center gap-1">
                <i className="fa fa-envelope" aria-hidden="true"></i> Email
              </Link>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h5 className="text-yellow-300 text-lg font-semibold uppercase mb-2">Links</h5>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-yellow-300">Home</Link></li>
            <li><Link to="/contact us" className="hover:text-yellow-300">Contact Us</Link></li>
            <li><Link to="/about us" className="hover:text-yellow-300">About Us</Link></li>
          </ul>
        </div>

        {/* Menu */}
        <div>
          <h5 className="text-yellow-300 text-lg font-semibold uppercase mb-2">Menu</h5>
          <ul className="space-y-1 text-sm">
            <li><Link to="/menu" onClick={() => fetchCategory("Breakfast")} className="hover:text-yellow-300">Breakfast</Link></li>
            <li><Link to="/menu" onClick={() => fetchCategory("Lunch")} className="hover:text-yellow-300">Lunch</Link></li>
            <li><Link to="/menu" onClick={() => fetchCategory("Dinner")} className="hover:text-yellow-300">Dinner</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h5 className="text-yellow-300 text-lg font-semibold uppercase mb-2">Social Link</h5>
          <ul className="space-y-1 text-sm">
            <li><Link to="https://facebook.com" className="hover:text-yellow-300 inline-flex items-center gap-2"><i className="fab fa-facebook-f" /> Facebook</Link></li>
            <li><Link to="https://twitter.com" className="hover:text-yellow-300 inline-flex items-center gap-2"><i className="fab fa-twitter" /> Twitter</Link></li>
            <li><Link to="https://instagram.com" className="hover:text-yellow-300 inline-flex items-center gap-2"><i className="fab fa-instagram" /> Instagram</Link></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
