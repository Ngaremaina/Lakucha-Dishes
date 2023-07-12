import React from "react";
import { Nav } from "react-bootstrap";

const NavHeader = () => {

    return(
        <Nav>
            <Nav.Link href = "/">Home</Nav.Link>
            <Nav.Link href = "/menu">Menu</Nav.Link>  
            <Nav.Link href = "/recipes">Recipes</Nav.Link>
            {/* <Nav.Link href = "/about">About</Nav.Link> */}
            <Nav.Link href = "/contact">Contact</Nav.Link>          
        </Nav>
    )

}

export default NavHeader