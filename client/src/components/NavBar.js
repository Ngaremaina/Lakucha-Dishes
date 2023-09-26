import React from "react";
import { NavLink, Link } from "react-router-dom";

const NavBar = ({fetchCategory, fetchProducts}) => {
    return(
        <nav className="navbar navbar-expand-lg sticky-top" style={{backgroundColor:"#393E41"}}>
        <div className="container-fluid">

            <NavLink className="navbar-brand text-white" to="/">Lakucha Dishes</NavLink>
          
            <div className="justify-content-center">
                <ul className="navbar-nav">            
                    <li className="nav-item">
                    <NavLink className="nav-link text-white" onClick = {() => fetchProducts()} to="/">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <div className="dropdown">
                            <NavLink className="nav-link text-white">Menu</NavLink>
                            <div className="dropdown-content">
                                <Link className="nav-link text-white" onClick={() => fetchCategory("Breakfast")} to="/">Breakfast</Link>
                                <Link className="nav-link text-white" onClick={() => fetchCategory("Lunch")} to="/">Lunch</Link>
                                <Link className="nav-link text-white" onClick={() => fetchCategory("Dinner")} to="/">Dinner</Link>
                            </div>
                        </div>
                    
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/about us">About Us</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/contact us">Contact Us</Link>
                    </li>
                </ul>
            </div>


            <div>
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <NavLink className="nav-link text-white" to="/signin"><i className="fa fa-sign-in" aria-hidden="true"></i> Login</NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink className="nav-link text-white" to="/signup"><i className="fa fa-user-plus" aria-hidden="true"></i> Register</NavLink>
                        </li>
                        <li className="nav-item">
                        <NavLink className="nav-link text-white" to="/mycart"><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</NavLink>
                    </li>
                </ul>
            </div>
        </div>
        </nav>

    )

}

export default NavBar