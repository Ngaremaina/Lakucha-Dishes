import React, { useState } from "react";
import { Nav,Button,Form,InputGroup } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

function Header({searchFood}){
    const [search, setSearch] = useState("")
    
    const handleSubmit = (e) => {
        e.preventDefault()
        searchFood(search)
    }
    return (
        <Nav className="navbar navbar-expand-sm text-white">
            <div className="container-fluid ">
                <Link to="/" className="nav-link" style={{marginRight : "20px"}}>Home</Link>
               
                <div className="collapse navbar-collapse justify-content-end">
                    <Form className="navbar-form navbar-right" id="search-form" onSubmit={handleSubmit}>
                        <InputGroup>
                            <input type="text" className="form-control" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}/>
                            <Button className="btn btn-default" type="submit">
                                <Search />
                            </Button>
                        </InputGroup>
                    </Form>
                </div>
            </div>
	    </Nav>
       
        
    )

}

export default Header