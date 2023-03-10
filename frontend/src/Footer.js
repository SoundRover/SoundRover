import React, { useState } from 'react';
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import RepeatIcon from "@material-ui/icons/Repeat";
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import './Footer.css';
import { Slider } from '@material-ui/core';
import { useDataLayerValue } from './DataLayer';
import SpotifyWebApi from "spotify-web-api-js";
import { withStyles } from '@material-ui/core/styles';
import SidebarOption from './SidebarOption';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import { useMediaQuery } from '@material-ui/core';

const spotify = new SpotifyWebApi();

const ColoredSlider = withStyles({
    root: {
      color: '#e87121',
    },
  })(Slider);

function Footer() {
    const isMobile = useMediaQuery('(max-width:600px)');

    const [isPlaying, setIsPlaying] = useState(false);
    const [isSmartphoneAvailable, setIsSmartphoneAvailable] = useState(true);

    // Get the Spotify API object
    const [{ spotify }, dispatch] = useDataLayerValue();

    // Event handler for clicking the play/pause button
    const handlePlayPauseClick = async () => {
        // Get current playback state
        const playerState = await spotify.getMyCurrentPlaybackState();
        
        // Print out list of Spotify devices
        spotify.getMyDevices().then(response =>
            console.log("My Devices: ", response.devices)
        );

        // Play/Pause logic
        if (playerState?.is_playing) {
            setIsPlaying(false);
            spotify.pause();
        } else {
            spotify.getMyDevices().then(response => {
                // Find the first device in the array with a type of "Smartphone"
                const smartphoneDevice = response.devices.find(device => device.type === "Smartphone");
                
                // If a smartphone device was found, transfer playback to it.
                if (smartphoneDevice) {
                    spotify.transferMyPlayback([smartphoneDevice.id], { play: true });
                    setIsPlaying(true);
                    setIsSmartphoneAvailable(true);
                    console.log("Playback transferred to smartphone device:", smartphoneDevice);
                } else {
                    console.log("No smartphone device found.");
                    setIsSmartphoneAvailable(false);
                    // Update the content of the div to show the error message for 5 seconds
                    setTimeout(() => {
                    // Change the content of the div back to its original state after 5 seconds
                    setIsSmartphoneAvailable(true);
                    }, 5000);
                }
            });
        }
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
                {isSmartphoneAvailable ? (
                    <><ShuffleIcon className="footer__orange" /><SkipPreviousIcon className="footer__icon" />
                    {isPlaying ? (
                    <PauseCircleOutlineIcon fontSize="large" className="footer__icon" onClick={handlePlayPauseClick} />
                    ) : (
                    <PlayCircleOutlineIcon fontSize="large" className="footer__icon" onClick={handlePlayPauseClick} />
                    )}
                    <SkipNextIcon className="footer__icon" />
                    <RepeatIcon className="footer__orange" />
                    </>
                ) : (
                    <p className="footer__error">Please open the Spotify app on your phone.</p>
                ) }
            </div>

            <div className="footer__right">
                <VolumeDownIcon />
                <ColoredSlider defaultValue={100} aria-labelledby="continuous-slider" className="volume-slider"/>
                <VolumeUpIcon />
            </div>

            <div className="footer__mobile__sidebar">
            {isMobile && (
                <>
                    <SidebarOption Icon={HomeIcon} className="mobile-icon" />
                    <SidebarOption Icon={SearchIcon} className="mobile-icon" />
                    <SidebarOption Icon={LibraryMusicIcon} className="mobile-icon" />
                </>
            )}
            </div>
        </div>
    );
}

export default Footer;
