import React from 'react'
import {NavLink} from 'react-router-dom';

const Navbar = () => {
    const linkStyle = {
        textDecoration:"none",
        listStyle:"none",
        color:"Black",
        fontSize: "20px",
        fontWeight:"Bold"
      };

  return (
    <>
    <div className="tab">
    <NavLink  style={linkStyle} to='/signup'>SignUp</NavLink>
    <NavLink  style={linkStyle}to='/'>Log in</NavLink>
    </div>
    </>
  )
}

export default Navbar