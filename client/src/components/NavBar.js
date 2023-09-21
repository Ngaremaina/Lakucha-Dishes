import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return(
        <nav className="navbar navbar-expand-lg bg-dark sticky-top">
        <div className="d-flex container-fluid">

            <NavLink className="navbar-brand text-white" to="/">Lakucha Dishes</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
            </button>

            <div className="justify-content-center collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
                <li className="nav-item">
                <NavLink className="nav-link text-white" aria-current="page" to="/">Home</NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link text-white" to="/recipes">Recipes</NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link text-white" to="/contact us">Contact Us</NavLink>
                </li>
            </ul>
            </div>
            <div>
            <ul className="navbar-nav">
            <li className="nav-item">
                <NavLink className="nav-link text-white" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link text-white" to="/register">Register</NavLink>
                </li>
                <li className="nav-item">
                <NavLink className="nav-link text-white" to="/cart">Cart</NavLink>
                </li>
            </ul>
            </div>
        </div>
        </nav>

    )

}

export default NavBar