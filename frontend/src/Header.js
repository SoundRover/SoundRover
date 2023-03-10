import React, { useState } from 'react';
import './Header.css';
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from '@material-ui/core';
import { useDataLayerValue } from './DataLayer';

function Header() {

    const [{ user }] = useDataLayerValue();
    const [showMenu, setShowMenu] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    return (
        <div className="header">
            <div className="header__left">
                <SearchIcon />
                <input placeholder="Search for Artists, Songs or Podcasts"
                    type="text" />
            </div>

            <div className="header__right" onClick={toggleMenu}>
                <Avatar src={user?.images[0].url} alt={user?.display_name} />
                <h4>{user?.display_name}</h4>
                {showMenu && (
                    <div className="dropdown">
                        <ul>
                            <li>Log out</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header;
