import React, { useEffect } from 'react';
import './App.css';
import Login from './Login';
import { getTokenFromResponse } from './Spotify';
import SpotifyWebApi from "spotify-web-api-js";
import Player from './Player';
import { useDataLayerValue } from './DataLayer';

// Create the Spotify API object
const spotify = new SpotifyWebApi();

/*
Notes about the Data Layer (aka context)
- The data layer is what we use to store global stateful variables 
- We will use two main functions: useDataLayerValue and dispatch
    - 'useDataLayerValue' gets variables from context 
    - 'dispatch' function stores variables to the context
*/

function App() {

  // Get the 'token' variable from the Data Layer (aka: context)
  const [{token}, dispatch] = useDataLayerValue();

  /*
  useEffect() hook: 
    - Handles authentication process and obtains access token for Spotify API
    - This only runs once, but useEffect hooks can run anytime a state variable changes
    - sets the token state variable once authentication is complete.
  */
  useEffect(() => {
    const hash = getTokenFromResponse();
    window.location.hash = "";
    const _token = hash.access_token;

    if (_token) {
      dispatch({
        type: "SET_TOKEN",
        token: _token,
      });

      spotify.setAccessToken(_token);

      spotify.getMe().then(user => {
        dispatch({
          type: 'SET_USER',
          user: user
        });
      });

      spotify.getUserPlaylists().then((playlists) => {
        dispatch({
          type: "SET_PLAYLISTS",
          playlists: playlists
        });
      });

      spotify.getPlaylist('0hbMSLbsYCf7yiiFN9VN4R').then((response) => {
        dispatch({
          type: "SET_SELECTED_MUSIC",
          selected_music: response
        });
      });

      spotify.getMyCurrentPlaybackState().then((playerState) => {
        dispatch({
          type: "SET_PLAYING",
          isPlaying: playerState?.is_playing
        });
        dispatch({
          type: "SET_SHUFFLE",
          isShuffling: playerState?.shuffle_state
        });
        console.log("INITIAL REPEAT STATE: ", playerState?.repeat_state)
        dispatch({
          type: "SET_REPEAT",
          repeatMode: playerState?.repeat_state
        });
      });
                  
      dispatch({
        type: "SET_SPOTIFY",
        spotify: spotify
      });
    }

  // Listed below are the variables that this useEffect hook listens to for changes!
  // Since token only changes once, this code only runs once
  }, [token, dispatch]);

  return (
    <div className="app">
      {
        token ? (
          <Player spotify={spotify} />
        ) : (
          <Login />
        )
      }
    </div>
  );
}

export default App;
