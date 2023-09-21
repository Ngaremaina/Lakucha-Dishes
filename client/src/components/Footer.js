import React from "react";
import { Link } from "react-router-dom";

const Footer = ({fetchCategory}) => {
  return (
        <footer className="row row-cols-5 py-2 mt-3 border-top bg-dark text-white">
          <div className="col">
            <h5 className="mt-4 text-uppercase">Lakucha Dishes</h5>
            <ul className="nav flex-column">
              <li className="nav-item" style={{color:"#FFFC31"}}>Join us on a mouthwatering journey filled with tantalizing recipes, expert cooking tips, and a feast for your senses.</li>
            </ul>

          </div>
          <div className="col">
            <h5 className="text-uppercase">Contacts</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2" style={{color:"#FFFC31"}}>Utawala, Nairobi</li>
            <li className="nav-item mb-2" style={{color:"#FFFC31"}}>Tel: +25478945612</li>
            <li className="nav-item" ><Link className="p-0" style={{color:"#FFFC31"}} to="mailto:lakuchadishes@gmail.com"><i className="fa fa-envelope" aria-hidden="true"></i> Email</Link></li>
            </ul>
            
          </div>
          <div className="col">
            <h5 className="text-uppercase">Links</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><Link className="nav-link p-0" style={{color:"#FFFC31"}} to="/">Home</Link></li>
              <li className="nav-item mb-2"><Link className="nav-link p-0" style={{color:"#FFFC31"}} to="/contact us">Contact Us</Link></li>
              <li className="nav-item mb-2"><Link className="nav-link p-0" style={{color:"#FFFC31"}} to="/about us">About Us</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5 className="text-uppercase">Menu</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><Link className="nav-link p-0" style={{color:"#FFFC31"}} onClick={() => fetchCategory("Breakfast")} to="/">Breakfast</Link></li>
              <li className="nav-item mb-2"><Link className="nav-link p-0" style={{color:"#FFFC31"}} onClick={() => fetchCategory("Lunch")} to="/">Lunch</Link></li>
              <li className="nav-item mb-2"><Link className="nav-link p-0" style={{color:"#FFFC31"}} onClick={() => fetchCategory("Dinner")} to="/">Dinner</Link></li>
            </ul>
          </div>
          <div className="col">
            <h5 className="text-uppercase">Social Link</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2"><Link to="www.facebook.com" style={{color:"#FFFC31"}} className="nav-link p-0"><i className="fab fa-facebook-f" /> Facebook</Link></li>
              <li className="nav-item mb-2"><Link to="www.twitter.com" style={{color:"#FFFC31"}} className="nav-link p-0"><i className="fab fa-twitter" /> Twitter</Link></li>
              <li className="nav-item mb-2"><Link to="www.instagram.com" style={{color:"#FFFC31"}} className="nav-link p-0"><i className="fab fa-instagram" /> Instagram</Link></li>
            </ul>
          </div>
        </footer>


  );
};

export default Footer;
