import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";

const Footer = () => {
  const { data: categories } = useCategories();

  return (
    <footer className="bg-ink text-white py-12 px-4 md:px-12 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">

        <div>
          <h5 className="text-brand-300 text-lg font-semibold uppercase mb-2">Lakucha Dishes</h5>
          <p className="text-sm text-white/80">
            Join us on a mouthwatering journey filled with tantalizing recipes,
            expert cooking tips, and a feast for your senses.
          </p>
        </div>

        <div>
          <h5 className="text-brand-300 text-lg font-semibold uppercase mb-2">Contacts</h5>
          <ul className="space-y-1 text-sm text-white/80">
            <li>Utawala, Nairobi</li>
            <li>Tel: +25478945612</li>
            <li>
              <a href="mailto:lakuchadishes@gmail.com" className="hover:text-brand-300">
                lakuchadishes@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-brand-300 text-lg font-semibold uppercase mb-2">Links</h5>
          <ul className="space-y-1 text-sm text-white/80">
            <li><Link to="/" className="hover:text-brand-300">Home</Link></li>
            <li><Link to="/contact" className="hover:text-brand-300">Contact Us</Link></li>
            <li><Link to="/about" className="hover:text-brand-300">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-brand-300 text-lg font-semibold uppercase mb-2">Menu</h5>
          <ul className="space-y-1 text-sm text-white/80">
            {categories?.map((category) => (
              <li key={category.id}>
                <Link to={`/menu?category=${category.id}`} className="hover:text-brand-300">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-brand-300 text-lg font-semibold uppercase mb-2">Social Link</h5>
          <ul className="space-y-1 text-sm text-white/80">
            <li><a href="https://facebook.com" className="hover:text-brand-300">Facebook</a></li>
            <li><a href="https://twitter.com" className="hover:text-brand-300">Twitter</a></li>
            <li><a href="https://instagram.com" className="hover:text-brand-300">Instagram</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
