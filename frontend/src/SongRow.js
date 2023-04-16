import React, { useEffect } from 'react';
import './SongRow.css'
import { useDataLayerValue } from './DataLayer';
import { useMediaQuery } from '@material-ui/core';


function SongRow({ track }) {
    // Get the Spotify API object
    const [{ spotify }, dispatch] = useDataLayerValue();

    // Check if mobile device (double-click on desktop to play song vs. single tap on mobile)
    const isMobile = useMediaQuery('(max-width:600px)');

    // For desktop version
    // Queue song upon double click (immediate playback is not available on spotify web api)
    async function handleDoubleClick() {
        if (!isMobile){
            await spotify.play({ uris: [track.uri], });
            console.log("Song double clicked!");
        }
    }

    // For mobile version
    // Queue song upon single tap
    async function handleClick() {
        if (isMobile){
            await spotify.play({ uris: [track.uri], });
            console.log("Song tapped!");
        }
    }

    return (
        <div className="songRow" onDoubleClick={handleDoubleClick} onClick={handleClick}>
            <img className="songRow__album" src={track.album.images[0].url} alt="" />
            <div className="songRow__info">
                <h1>{track.name}</h1>
                <p>
                    {track.artists.map((artist) => artist.name).join(", ")} - {" "}
                    {track.album.name}
                </p>
            </div>
            
        </div>
    )
}

export default SongRow;