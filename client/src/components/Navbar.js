import React, { useState } from "react";
import {Link} from "react-router-dom"

const NavHeader = ({getSearch}) => {
    const [search, setSearch] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        getSearch(search)
        
    }
    const handleChange = (event) => {
        return setSearch(event.target.value)
    }

    return(
        <nav className="nav bg-dark">
            <Link className = "nav-link" to="/">Home</Link>
            <Link className = "nav-link" to ="/menu">Menu</Link>
            <form onSubmit={handleSubmit}>
                <input type="text" className="" value={search} id = "search" onChange={handleChange}/>
                <button className="btn-primary">Submit</button>
            </form>
        </nav>
    )

}

export default NavHeader