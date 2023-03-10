import React, { useEffect } from 'react';
import './SongRow.css'
import { useDataLayerValue } from './DataLayer';

function SongRow({ track }) {
    // Get the Spotify API object
    const [{ spotify }, dispatch] = useDataLayerValue();

    function handleDoubleClick() {
        spotify.queue(`spotify:track:${track.id}`)
    }

    return (
        <div className="songRow" onDoubleClick={handleDoubleClick}>
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