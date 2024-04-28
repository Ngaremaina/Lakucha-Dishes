import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "./Authentication";

const NavBar = ({fetchCategory, fetchProducts}) => {
    const { logout, admin } = useAuth()
    return(
        <nav className="navbar navbar-expand-lg sticky-top" style={{backgroundColor:"#393E41"}}>
        <div className="container-fluid">

            <NavLink className="navbar-brand text-white" onClick = {() => fetchProducts()} to="/">Lakucha Dishes</NavLink>
          
            <div className="justify-content-center">
                <ul className="navbar-nav">            
                    <li className="nav-item">
                    <NavLink className="nav-link text-white" onClick = {() => fetchProducts()} to="/">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <div className="dropdown">
                            <NavLink className="nav-link text-white">Menu</NavLink>
                            <div className="dropdown-content">
                                <Link className="nav-link text-white" onClick={() => fetchCategory("Breakfast")} to="/menu">Breakfast</Link>
                                <Link className="nav-link text-white" onClick={() => fetchCategory("Lunch")} to="/menu">Lunch</Link>
                                <Link className="nav-link text-white" onClick={() => fetchCategory("Dinner")} to="/menu">Dinner</Link>
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
                        <NavLink className="nav-link text-white">{admin.username}</NavLink>
                    </li>
                    
                    <li className="nav-item">
                        <NavLink className="nav-link text-white" to="/mycart"><i className="fa fa-shopping-cart" aria-hidden="true"></i> Cart</NavLink>
                    </li>
                   
                    <li className="nav-item">
                        <NavLink className="nav-link text-white" onClick={logout} ><i className="fa fa-sign-in" aria-hidden="true"></i> Logout</NavLink>
                    </li>
                </ul>
            </div>
        </div>
        </nav>

    )

}

export default NavBar