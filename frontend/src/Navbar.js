import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    /* The Navbar component consists of three sections: 1) setting the state to show 
        which page is active, 2) creating a handleClick function object that takes an
        event 'e' as a paremeter, 3) return */

    // The "active" state variable shows which page is active
  const [active, setActive] = useState("Home");

  // The handleClick function object is a setter function for the "active" state var
  const handleClick = (e) => {
    setActive(e.target.name);
  };

  return (
    /* The Navbar component consists of 3 'Link' objects: Home, About, and Contact
    
        The 'Link' component is part of the 'react-router-dom' library and is used
        to create a CLICKABLE element that navigates to a DIFFERENT ROUTE

        Each 'Link' component contains four props: 
            1) 'to' : route that it directs to
            2) 'className' : used as a CSS class 
                (Note: the ternary operator is being used to determine if the class is also 'active')
                
                TERNARY SYNTAX: 'condition ? true_value : false_value'

            3) 'name' : this is a CUSTOM property which is not necessary but makes it more readable
            4) 'onClick' : attaches the event handler function 'handleClick' that is called
                            whenever the 'Link' is clicked
    */
    <div className="navbar">
      <Link
        to="/"
        className={`navbar__item ${active === "Home" ? "active" : ""}`}
        name="Home"
        onClick={handleClick}
      >
        Home
      </Link>
      <Link
        to="/about"
        className={`navbar__item ${active === "About" ? "active" : ""}`}
        name="About"
        onClick={handleClick}
      >
        About
      </Link>
      <Link
        to="/contact"
        className={`navbar__item ${active === "Contact" ? "active" : ""}`}
        name="Contact"
        onClick={handleClick}
      >
        Contact
      </Link>
    </div>
  );
};

export default Navbar;
