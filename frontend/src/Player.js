import React from 'react';
import Body from './Body';
import './Player.css';
import Sidebar from './Sidebar';
import Footer from './Footer';


function Player() {
    return (
        <div className="player">
            <div className="player__body">

                <Sidebar />
                <Body />

            </div>
            <Footer />
        </div>
    );
}

export default Player;
