import React, { useState, useEffect } from 'react';
import './Header.css';
import SearchIcon from "@material-ui/icons/Search";
import { Avatar } from '@material-ui/core';
import { useDataLayerValue } from './DataLayer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Header({ activeOption, arrowClick, showPlaylistList }) {

    const [{ user }] = useDataLayerValue();
    const [showMenu, setShowMenu] = useState(false);
    const [{ spotify }, dispatch] = useDataLayerValue();
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    }

    // Queries Spotify's search API with search term
    // whenever enter key is detected
    const searchSpotify = () => {
        let input = document.getElementById("search");
        let query = input.value;
        
        spotify.searchTracks(query, {limit: 10})
        .then(function(data) {
            console.log('Search results: ', data);
            setSearchResults(data.tracks.items);
            setShowResults(true);
        
          }, function(error) {
            console.error(error);
          });
    }

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowResults(false);
        }, 200);
    }

    const playSong = (uri) => {
        spotify.play({
            uris: [uri]
        })
        .then(() => {
            console.log("Playing song with uri: ", uri);
        }, (err) => {
            console.error(err);
        });
    }

    useEffect(() => {
        if (activeOption !== 'Search') {
            setShowResults(false);
        }
    }, [activeOption]);

    const renderHeaderContent = () => {
        switch (activeOption) {
            case 'Home':
                return (
                    <div className="header">
                        <div className="header__right" onClick={toggleMenu}>
                            <Avatar src={user?.images[0] && user?.images[0].url} alt={user?.display_name} />
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
                );
            case 'Search':
                return (
                    <div className="header">
                        <div className="header__left">
                            <SearchIcon />
                            <input id="search" type="text" class="input" placeholder="Search..." 
                                onKeyDown={(event) => {if(event.key === 'Enter') searchSpotify()}}
                            />
                        </div>
                        {showResults && searchResults.length > 0 && (
                                <div className="header__searchResults">
                                    {searchResults.map((result) => (
                                        <>
                                        <div key={result.id} className="header__searchResult" onClick={() => playSong(result.uri)}>
                                            <img src={result.album.images[0].url} alt="" />
                                            <div>
                                                <h4>{result.name}</h4>
                                                <p>{result.artists.map((artist) => artist.name).join(', ')}</p>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        </>
                                    ))}
                                </div>
                            )}
                    </div>
                );
            case 'Your Library':
                return (
                    <div className="header__library">
                        {showPlaylistList ? (
                            <h2>Playlists</h2>
                        ) : (
                            <ArrowBackIcon className="backIcon" onClick={arrowClick} />
                        )}
                        <div className="header__right" onClick={toggleMenu}>
                            <Avatar src={user?.images[0] && user?.images[0].url} alt={user?.display_name} />
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
                );
            default:
                return (
                    <div className="header">
                        <div className="header__left">
                            <SearchIcon />
                            <input id="search" type="text" class="input" placeholder="Search..." 
                                onKeyDown={(event) => {if(event.key === 'Enter') searchSpotify()}}
                                onBlur={handleInputBlur}
                            />
                            {showResults && searchResults.length > 0 && (
                                <div className="header__searchResults">
                                    {searchResults.map((result) => (
                                        <div key={result.id} className="header__searchResult" onClick={() => playSong(result.uri)}>
                                            <img src={result.album.images[0].url} alt="" />
                                            <div>
                                                <h4>{result.name}</h4>
                                                <p>{result.artists.map((artist) => artist.name).join(', ')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
            
                        <div className="header__right" onClick={toggleMenu}>
                            <Avatar src={user?.images[0] && user?.images[0].url} alt={user?.display_name} />
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
                );
        }
    };

    return (
        <>
            {renderHeaderContent()}
        </>
    )
}

export default Header;
