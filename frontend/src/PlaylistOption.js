import React from 'react';
import './PlaylistOption.css';

function PlaylistOption({ title, key, id, image, onClick }) {

    return (
        <div className="playlistOption" key={key} onClick={onClick}>
            <img src={image} className="playlistImage" />
            <h3 className="playlistTitle">{title}</h3>
        </div>
    );
}

export default PlaylistOption;