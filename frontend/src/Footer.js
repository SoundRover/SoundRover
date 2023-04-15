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
import geniusLogo from './assets/genius.png';

const ColoredSlider = withStyles({
    root: {
      color: '#e87121',
    },
  })(Slider);

function Footer(props) {
    // State Variables
    const [isSmartphoneAvailable, setIsSmartphoneAvailable] = useState(true);
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [factsOrLyrics, setFactsOrLyrics] = useState(false);
    const [activeFactButton, setActiveFactButton] = useState(null);
    // const [loading, setLoading] = useState(false);

    // Get global variables
    const [{ spotify, currentTrack, isPlaying, isShuffling, repeatMode, factsExpanded, factsLoading, factType }, dispatch] = useDataLayerValue();
    const isMobile = useMediaQuery('(max-width:600px)');

    // OpenAI API
    let [obj, setObj] = useState({ choices: [] });
    const [payload, setPayLoad] = useState({
        prompt: currentTrack ? `Please write four facts about the song ${currentTrack.name} by ${currentTrack.artists[0].name}, with each fact being 200 characters or less.
        Separate each fact with the characters <&&>` : 'Please write the text "Loading..."',

        temperature: 0.5,
        n: 1,
        model: "text-davinci-003", 
        max_tokens: 400
    });

    const handleFactButtonClick = (buttonName) => {
        setActiveFactButton(buttonName);
        dispatch({ type: "SET_FACT_TYPE", factType: buttonName });
      };

    useEffect(() => {
        const getRes = async () => {
                dispatch({ type: "SET_FACTS_LOADING", factsLoading: true});
                axios({
                    method: "POST",
                    url: "https://api.openai.com/v1/completions",
                    data: payload,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                        // "Bearer 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"
                        "Bearer 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" // Andrew's Key

                    }
                })
                .then((res) => {
                    console.log("OPEN AI RESPONSE: ",res);
                    responseHandler(res);
                })
                .catch((e) => {
                    dispatch({ type: "SET_FACTS_LOADING", factsLoading: false});
                    console.log(e.message, e);
                });
        };
        if (factsExpanded) {
            getRes();
        }
    }, [factsExpanded, factType]);

    function responseHandler(res) {
        if (res.status === 200) {
            const pieces = res.data.choices[0].text.split("<&&>");

            const result = {
                choices: pieces
            };

            setObj(result);
            dispatch({ type: "SET_FACTS_LOADING", factsLoading: false });
        }
    }
    
    // Handler for expanding the footer
    const handleFooterExpand = () => {
        dispatch({ type: "SET_FACTS_EXPANDED", factsExpanded: !factsExpanded});
    };

    // Get the current playing track once every second
    useEffect(() => {
        // Set up a timer to query the Spotify API every second
        const interval = setInterval(() => {
          spotify.getMyCurrentPlayingTrack().then((response) => {
            console.log(factType);
            dispatch({
                type: "SET_CURRENT_TRACK",
                currentTrack: response?.item
              });
              if(factType === "basic"){
                setPayLoad({
                ...payload,
                prompt:`Please write four facts about the song ${response?.item.name} by ${response?.item.artists[0].name}, with each fact being 200 characters or less.
                Separate each fact with the characters <&&>`
                });
              }
              else if(factType === "Background"){
                setPayLoad({
                    ...payload,
                    prompt:`Please write four facts about the background and insiration for the song ${response?.item.name} by ${response?.item.artists[0].name}, 
                    with each fact being 200 characters or less. Separate each fact with the characters <&&>`
                });
              }
              else if(factType === "Band Members"){
                setPayLoad({
                    ...payload,
                    prompt:`Please write four facts about the members of the band that plays the song ${response?.item.name} by ${response?.item.artists[0].name}, 
                    with each fact being 200 characters or less. Separate each fact with the characters <&&>`
                });
              }
              else if(factType === "Discography"){
                setPayLoad({
                    ...payload,
                    prompt:`Please write four facts about the other discography of the band that plays the song ${response?.item.name} by ${response?.item.artists[0].name}, 
                    with each fact being 200 characters or less. Separate each fact with the characters <&&>`
                });
              }
              else if(factType === "Recording"){
                setPayLoad({
                    ...payload,
                    prompt:`Please write four facts about the recording and mixing of the song ${response?.item.name} by ${response?.item.artists[0].name}, 
                    with each fact being 200 characters or less. Separate each fact with the characters <&&>`
                });
              }
              else{
                setPayLoad({
                    ...payload,
                    prompt:`Please write four facts about the song ${response?.item.name} by ${response?.item.artists[0].name}, with each fact being 200 characters or less.
                    Separate each fact with the characters <&&>`
                });
              }
          });
        }, 1000);
    
        // Clear timer when the component unmounts
        return () => clearInterval(interval);
      }, [factType]);

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

    // Create divs for facts
    const factDivs = obj.choices.map((fact, index) => (
        <div key={index} style={{ display: index === visibleIndex ? 'block' : 'none' }}>
            {fact}
        </div>
    ));

    const pageCircleIcons = [0, 1, 2, 3].map((fact, index) => (
        <CircleIcon className="fact-box-circle-icon" key={index} style={{ color: index === visibleIndex ? 'white' : 'black' }}/>
    ));

    const nextFact = async () => {
        setVisibleIndex((visibleIndex + 1) % obj.choices.length);
    }

    const prevFact = async () => {
        setVisibleIndex((visibleIndex - 1) % obj.choices.length);
    }

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

    // Switch between lyrics and song facts
    const footerSwitch = (currentState) => {
        if (factsOrLyrics !== currentState) {
            setFactsOrLyrics(!factsOrLyrics);
        }
    };

    
    const [lyrics, setLyrics] = useState('');

    useEffect(() => {
        if (factsOrLyrics) {
            const fetchLyrics = async () => {
                const options = {
                    method: 'GET',
                    url: 'https://genius-song-lyrics1.p.rapidapi.com/search/',
                    params: {q: `${currentTrack?.name} ${currentTrack?.artists[0].name}`, per_page: '1', page: '1'},
                    headers: {
                        'X-RapidAPI-Key': '1c69ecda8amsh7607b507f1581f0p19e57ajsn4f6ddcfe3dce',
                        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
                    }
                };

                console.log(options.params);

                let songID = "";
                let options2 = null;

                axios.request(options).then(function (response1) {
                    songID = response1.data.hits[0].result.id;
                    console.log("Response1: ", response1.data);
                    options2 = {
                        method: 'GET',
                        url: 'https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/',
                        params: {id: songID, text_format: 'plain'},
                        headers: {
                        'X-RapidAPI-Key': '1c69ecda8amsh7607b507f1581f0p19e57ajsn4f6ddcfe3dce',
                        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
                        }
                    };

                    return axios.request(options2);
                }).then(function (response2) {
                    console.log("Response2: ", response2.data);
                    setLyrics(response2.data.lyrics.lyrics.body.plain.replace(/\n/g, '<br>'));
                }).catch(function (error) {
                    console.error(error);
                });

                console.log("OPTIONS2: ", options2);
            };
        
            fetchLyrics();
        }
    }, [factsOrLyrics]);

    return (
        <div className={`footer ${factsExpanded ? 'factsExpanded' : ''}`}>
            {factsExpanded && (
                <>
                <div className="footer__switch">
                    <div className="footer__switchLeft" onClick={footerSwitch.bind(this, true)}
                    style={{ backgroundColor: factsOrLyrics ? '#944816' : '#e87121' }}>
                    <img src={geniusLogo} alt="" />
                    Lyrics
                    </div>
                    <div className="footer__switchRight" onClick={footerSwitch.bind(this, false)}
                    style={{ backgroundColor: factsOrLyrics ? '#e87121' : '#944816' }}>
                    Song Facts
                    </div>
                </div>
                <div className="footer__boxContainer">
                    <div className="fact-box">
                        {factsOrLyrics ? (
                            <div className="footer__lyricsBox" dangerouslySetInnerHTML={{ __html: lyrics }}>
                            </div>
                        ) : (
                        <>
                        <div className="fact-box-content">

                            <div className="fact-box-buttons">
                                <div className = "fact-box-buttons">
                                    <button
                                        className={`fact-box-button ${
                                        activeFactButton === "Background" ? "active" : ""
                                        }`}
                                        onClick={() => handleFactButtonClick("Background")}
                                    >
                                        Background
                                    </button>
                                    <button
                                        className={`fact-box-button ${
                                        activeFactButton === "Band Members" ? "active" : ""
                                        }`}
                                        onClick={() => handleFactButtonClick("Band Members")}
                                    >
                                        Band Members
                                    </button>
                                    <button
                                        className={`fact-box-button ${
                                        activeFactButton === "Discography" ? "active" : ""
                                        }`}
                                        onClick={() => handleFactButtonClick("Discography")}
                                    >
                                        Discography
                                    </button>
                                    <button
                                        className={`fact-box-button ${
                                        activeFactButton === "Recording" ? "active" : ""
                                        }`}
                                        onClick={() => handleFactButtonClick("Recording")}
                                    >
                                        Recording
                                    </button>
                                </div>
                                <div className="fact-box-text">
                                    {activeFactButton === "Background" && <p>{props.background}</p>}
                                    {activeFactButton === "Band Members" && <p>{props.bandMembers}</p>}
                                    {activeFactButton === "Discography" && <p>{props.discography}</p>}
                                    {activeFactButton === "Recording" && <p>{props.recording}</p>}
                                </div>
                            </div>
                            
                            <div className= "song-facts">
                                <ArrowCircleLeftIcon fontSize="large" className="left-fact-arrow" onClick={prevFact} />
                                <div className="fact-box-text">{factsLoading ? (
                                    <span>Loading...</span>
                                ) : (
                                    <>
                                        {factDivs}
                                    </>
                                )}</div>
                                <ArrowCircleRightIcon fontSize="large" className="right-fact-arrow" onClick={nextFact} />
                            </div>
                        </div>
                        <div className="fact-box-pagination">
                            {pageCircleIcons}
                        </div>
                        </>
                        )}
                        
                    </div>
                </div>
                </>
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
