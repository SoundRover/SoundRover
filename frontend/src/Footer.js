import React from 'react';
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatIcon from "@material-ui/icons/Repeat";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import './Footer.css';
import { Grid, Slider } from '@material-ui/core';
import { useDataLayerValue } from './DataLayer';
import SpotifyWebApi from "spotify-web-api-js";

const spotify = new SpotifyWebApi();

function Footer() {

    // Get the Spotify API object
    const [{ spotify }, dispatch] = useDataLayerValue();

    // Event handler for clicking the play/pause button
    const handlePlayPauseClick = async () => {
        
        // Print out list of Spotify devices
        spotify.getMyDevices().then(response =>
            console.log("My Devices: ", response)
        );

        // TODO: CHANGE THIS TO INCLUDE PLAY/PAUSE LOGIC
        spotify.play(); 
    };

    return (
        <div className="footer">
            <div className="footer__left">
                <img className="footer__albumLogo" src="https://i1.sndcdn.com/artworks-UxM4BbNJZUXB-0-t500x500.jpg"
                    alt="" />
                <div className="footer__songInfo">
                    <h4>Jalebi Baby</h4>
                    <p>Tesher</p>

                </div>
            </div>

            <div className="footer__center">
                <ShuffleIcon className="footer__green" />
                <SkipPreviousIcon className="footer__icon" />
                <PlayCircleOutlineIcon fontSize="large" className="footer__icon" onClick={handlePlayPauseClick}/>
                <SkipNextIcon className="footer__icon" />
                <RepeatIcon className="footer__green" />
            </div>

            <div className="footer__right">
                <Grid container spacing={2}>
                    <Grid item>
                        <PlaylistPlayIcon />
                    </Grid>
                    <Grid item>
                        <VolumeDownIcon />
                    </Grid>
                    <Grid item xs>
                        <Slider aria-labelledby="continuous-slider" />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default Footer;
