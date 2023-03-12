import React, { useState, useEffect } from 'react';
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import ShuffleOnIcon from "@mui/icons-material/ShuffleOn";
import RepeatIcon from "@material-ui/icons/Repeat";
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import RepeatOneOnIcon from '@mui/icons-material/RepeatOneOn';
import VolumeDownIcon from "@material-ui/icons/VolumeDown";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import './Footer.css';
import { Slider } from '@material-ui/core';
import { useDataLayerValue } from './DataLayer';
import { withStyles } from '@material-ui/core/styles';
import SidebarOption from './SidebarOption';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import { useMediaQuery } from '@material-ui/core';


const ColoredSlider = withStyles({
    root: {
      color: '#e87121',
    },
  })(Slider);

function Footer() {
    // Get the Spotify API object
    const [{ spotify, isPlaying, isShuffling, repeatMode }, dispatch] = useDataLayerValue();

    const isMobile = useMediaQuery('(max-width:600px)');
    
    // State Variables
    // const [isPlaying, setIsPlaying] = useState(false);
    const [isSmartphoneAvailable, setIsSmartphoneAvailable] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);

    // Get the current playing track once every second
    useEffect(() => {
        // Set up a timer to query the Spotify API every second
        const interval = setInterval(() => {
          spotify.getMyCurrentPlayingTrack().then((response) => {
            setCurrentTrack(response.item);
          });
        }, 1000);
    
        // Clear timer when the component unmounts
        return () => clearInterval(interval);
      }, []);

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
            dispatch({ type: "SET_PLAYING", isPlaying: false});
            spotify.pause();
        } else {
            spotify.getMyDevices().then(response => {
                // Find the first device in the array with a type of "Smartphone"
                const smartphoneDevice = response.devices.find(device => device.type === "Smartphone");
                
                // If a smartphone device was found, transfer playback to it.
                if (smartphoneDevice) {
                    spotify.transferMyPlayback([smartphoneDevice.id], { play: true });
                    dispatch({ type: "SET_PLAYING", isPlaying: true});
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

    // Event handler for Skip Next Button
    const handleSkipNext = async () => {
        spotify.skipToNext();
    };

    // Event handler for Skip Previous Button
    const handleSkipPrev = async () => {
        spotify.skipToPrevious();
    };

    // Event handler for Shuffle Button
    const handleShuffle = async () => {
        // Get current playback state
        const playerState = await spotify.getMyCurrentPlaybackState();
        
        // If shuffle is currently on, turn it off
        if (playerState?.shuffle_state) {
            await spotify.setShuffle(false);
            dispatch({ type: "SET_SHUFFLE", isShuffling: false});
        } else {
            await spotify.setShuffle(true);
            dispatch({ type: "SET_SHUFFLE", isShuffling: true});
        }
    };

    // Event handler for Repeat Button
    const toggleRepeat = async () => {
        // Get current repeat mode
        const playerState = await spotify.getMyCurrentPlaybackState();
        
        // Toggle to next repeat mode & update global variable
        if (playerState?.repeat_state === "off") {
            await spotify.setRepeat("context");
            dispatch({ type: "SET_REPEAT",repeatMode: "context"});
        } 
        else if (playerState?.repeat_state === "context"){
            await spotify.setRepeat("track");
            dispatch({ type: "SET_REPEAT",repeatMode: "track"});
        } 
        else {
            await spotify.setRepeat("off");
            dispatch({ type: "SET_REPEAT",repeatMode: "off"});
        }
    };

    // Helper code to render shuffle icon
    const renderShuffleIcon = () => {
        if (isShuffling) {
            return <ShuffleOnIcon className="footer__orange" onClick={handleShuffle} />;
        } else {
            return <ShuffleIcon onClick={handleShuffle} />
        }
    }

    // Helper code to render repeat icon
    const renderRepeatIcon = () => {
        if (repeatMode === "off") {
          return <RepeatIcon onClick={toggleRepeat} />;
        } else if (repeatMode === "context") {
          return <RepeatOnIcon className="footer__orange" onClick={toggleRepeat} />;
        } else if (repeatMode === "track") {
          return <RepeatOneOnIcon className="footer__orange" onClick={toggleRepeat} />;
        }
        else {return <RepeatIcon onClick={toggleRepeat} />;}
      };

    return (
        <div className="footer">
            <div className="footer__left">
            {currentTrack && (
                <>
                <img className="footer__albumLogo" src={currentTrack.album.images[0].url} alt="Album cover" />
                <div className="footer__songInfo">
                    <h4>{currentTrack.name}</h4>
                    <p>{currentTrack.artists[0].name}</p>
                </div>
                </>
            )}
            </div>

            <div className="footer__center">
                {isSmartphoneAvailable ? (
                    <>
                    {renderShuffleIcon()}
                    <SkipPreviousIcon className="footer__icon" onClick={handleSkipPrev} />
                    {isPlaying ? (
                    <PauseCircleOutlineIcon fontSize="large" className="footer__icon" onClick={handlePlayPauseClick} />
                    ) : (
                    <PlayCircleOutlineIcon fontSize="large" className="footer__icon" onClick={handlePlayPauseClick} />
                    )}
                    <SkipNextIcon className="footer__icon" onClick={handleSkipNext}/>
                    {renderRepeatIcon()}
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
