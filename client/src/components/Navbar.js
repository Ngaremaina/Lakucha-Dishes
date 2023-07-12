import React from "react";
import { Nav } from "react-bootstrap";

const NavHeader = () => {

    return(
        <Nav>
            <Nav.Link href = "/login">Login</Nav.Link>
            <Nav.Link href = "/register">Register</Nav.Link>            
        </Nav>
    )

}

export default NavHeader