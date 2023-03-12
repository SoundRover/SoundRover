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
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CircleIcon from '@mui/icons-material/Circle';
import axios from 'axios';
import './FactBox.js';
import './FactBox.css';

const ColoredSlider = withStyles({
    root: {
      color: '#e87121',
    },
  })(Slider);

function Footer() {
    // State Variables
    // const [isPlaying, setIsPlaying] = useState(false);
    const [isSmartphoneAvailable, setIsSmartphoneAvailable] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Get the Spotify API object
    const [{ spotify, isPlaying, isShuffling, repeatMode }, dispatch] = useDataLayerValue();
    const isMobile = useMediaQuery('(max-width:600px)');

    // OpenAI API
    let [obj, setObj] = useState({ choices: [] });
    const [payload, setPayLoad] = useState({
        prompt: currentTrack ? `Please write a fact about the lyrics of the song ${currentTrack.name} by ${currentTrack.artists[0].name} in 200 characters or less.` : 'Please write the text "Loading..."',

        temperature: 0.5,
        n: 1,
        model: "text-davinci-003", 
        max_tokens: 200
    });

    const getRes = () => {
        if (expanded) {
            setLoading(true);
            axios({
            method: "POST",
            url: "https://api.openai.com/v1/completions",
            data: payload,
            headers: {
                "Content-Type": "application/json",
                Authorization:
                "Bearer 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"
            }
            })
            .then((res) => {
                console.log(res);
                responseHandler(res);
            })
            .catch((e) => {
                setLoading(false);
                console.log(e.message, e);
            });
        }
        
    };

    const responseHandler = (res) => {
        if (res.status === 200) {
            setObj(res.data);
            setLoading(false);
        }
    };
    
    // Handler for expanding the footer
    const handleFooterExpand = () => {
        console.log("expand");
        getRes();
        setExpanded(!expanded);
    };

    // Get the current playing track once every second
    useEffect(() => {
        // Set up a timer to query the Spotify API every second
        const interval = setInterval(() => {
          spotify.getMyCurrentPlayingTrack().then((response) => {
            setCurrentTrack(response.item);
            setPayLoad({
                ...payload,
                prompt:`Please write an interesting fact about the song ${response.item.name}.`
            });
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
        <div className={`footer ${expanded ? 'expanded' : ''}`}>
            {expanded && (
                <div className="footer__boxContainer">
                    <div className="fact-box">
                        <div className="fact-box-content">
                            <ArrowCircleLeftIcon fontSize="large" className="left-fact-arrow"/>
                            <p className="fact-box-text">{loading ? (
                            <span>loading...</span>
                        ) : (
                            obj?.choices?.map((v, i) => <div>{v.text}</div>)
                        )}</p>
                            <ArrowCircleRightIcon fontSize="large" className="right-fact-arrow"/>
                        </div>
                        <div className="fact-box-pagination">
                            <CircleIcon className="fact-box-circle-icon"/>
                            <CircleIcon className="fact-box-circle-icon"/>
                            <CircleIcon className="fact-box-circle-icon"/>
                            <CircleIcon className="fact-box-circle-icon"/>
                        </div>
                    </div>
                </div>
            )}
            <div className="footer__left">
            {currentTrack && (
                <>
                <div className="footer__songContainer">
                    <img className="footer__albumLogo" src={currentTrack.album.images[0].url} alt="Album cover" />
                    <div className="footer__songInfo">
                        <h4>{currentTrack.name}</h4>
                        <p>{currentTrack.artists[0].name}</p>
                    </div>
                </div>
                <QueueMusicIcon fontSize="large" className="footer__icon" onClick={handleFooterExpand}/>
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
