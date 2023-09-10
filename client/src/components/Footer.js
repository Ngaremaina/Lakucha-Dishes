import React from "react";

const Footer = () => {
  return (
      <div className="container-fluid my-3">
        {/* Footer */}
        <footer className="text-center text-lg-start text-white" style={{backgroundColor: '#45526e'}}>
          {/* Grid container */}
          <div className="container p-4 pb-0">
            {/* Section: Links */}
            <section>
              {/*Grid row*/}
              <div className="row">
                {/* Grid column */}
                <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Lakucha Dishes
                  </h6>
                  <p>
                  Lakucha Dishes is a web application that allows users to browse a menu, place orders, and make payments for their favorite dishes from a restaurant. It's a convenient way for customers to enjoy delicious meals from the comfort of their homes or offices.
                  </p>
                </div>
                {/* Grid column */}
                <hr className="w-100 clearfix d-md-none" />
                {/* Grid column */}
                <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">Menu</h6>
                  <p>
                    <a className="text-white">Breakfast</a>
                  </p>
                  <p>
                    <a className="text-white">Lunch</a>
                  </p>
                  <p>
                    <a className="text-white">Dinner</a>
                  </p>
                  <p>
                    <a className="text-white">Beverages</a>
                  </p>
                </div>
                {/* Grid column */}
                <hr className="w-100 clearfix d-md-none" />
                {/* Grid column */}
                <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">
                    Useful links
                  </h6>
                  <p>
                    <a className="text-white">Home</a>
                  </p>
                  <p>
                    <a className="text-white">Menu</a>
                  </p>
                  <p>
                    <a className="text-white">Login</a>
                  </p>
                  <p>
                    <a className="text-white">Signup</a>
                  </p>
                </div>
                {/* Grid column */}
                <hr className="w-100 clearfix d-md-none" />
                {/* Grid column */}
                <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                  <h6 className="text-uppercase mb-4 font-weight-bold">Contact</h6>
                  <p><i className="fas fa-home mr-3" /> Utawala, Nairobi</p>
                  <p><i className="fas fa-envelope mr-3" /> lakuchadishes@gmail.com</p>
                  <p><i className="fas fa-phone mr-3" /> + 254 234 567 88</p>
                  <p><i className="fas fa-print mr-3" /> + 254 234 567 89</p>
                </div>
                {/* Grid column */}
              </div>
              {/*Grid row*/}
            </section>
            {/* Section: Links */}
            <hr className="my-3" />
            {/* Section: Copyright */}
            <section className="p-3 pt-0">
              <div className="row d-flex align-items-center">
                {/* Grid column */}
                <div className="col-md-7 col-lg-8 text-center text-md-start">
                  {/* Copyright */}
                  <div className="p-3">
                    © 2023 Copyright:
                    <a className="text-white" href="https://mdbootstrap.com/"> Lakucha Dishes</a>
                  </div>
                  {/* Copyright */}
                </div>
                {/* Grid column */}
                {/* Grid column */}
                <div className="col-md-5 col-lg-4 ml-lg-0 text-center text-md-end">
                  {/* Facebook */}
                  <a className="btn btn-outline-light btn-floating m-1" role="button"><i className="fab fa-facebook-f" /></a>
                  {/* Twitter */}
                  <a className="btn btn-outline-light btn-floating m-1" role="button"><i className="fab fa-twitter" /></a>
                  {/* Google */}
                  <a className="btn btn-outline-light btn-floating m-1" role="button"><i className="fab fa-google" /></a>
                  {/* Instagram */}
                  <a className="btn btn-outline-light btn-floating m-1" role="button"><i className="fab fa-instagram" /></a>
                </div>
                {/* Grid column */}
              </div>
            </section>
            {/* Section: Copyright */}
          </div>
          {/* Grid container */}
        </footer>
        {/* Footer */}
      </div>

  );
};

export default Footer;
