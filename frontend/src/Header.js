import React, { useState } from 'react';
import './Header.css';
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from '@material-ui/core';
import SongRow from './SongRow';
import { useDataLayerValue } from './DataLayer';

function Header() {

    const [{ user }] = useDataLayerValue();
    const [showMenu, setShowMenu] = useState(false);
    const [{ spotify }, dispatch] = useDataLayerValue();

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    const searchSpotify = () => {
        let input = document.getElementById("search");
        let query = input.value;
        
        let searchResults = spotify.searchTracks(query, {limit: 10})
        .then(function(data) {
            console.log('Search results', data);
            // for(int i = 0; i < data.tracks.items)

            // }
            dispatch({
                type: "SET_SELECTED_MUSIC",
                selected_music: data.tracks.items
              })
            // return (
            // <div className="body">
            //     <Header spotify={spotify} />
    
            //     <div className="body__songs">
            //         {/* List of Songs */}
            //         {data.tracks.items.map(item => (
            //             <SongRow key={item.id} track={item} />
            //         ))}
            //     </div>
            // </div>
        
          }, function(error) {
            console.error(error);
          });

          
    }

    return (
        <div className="header">
            <div className="header__left">
                <SearchIcon />
                <input id="search" type="text" class="input" placeholder="Search..." onKeyDown={event => {if(event.key === 'Enter') searchSpotify()}}/>
               
            </div>

            <div className="header__right" onClick={toggleMenu}>
                {/* <Avatar src={user?.images[0].url} alt={user?.display_name} /> */}
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
