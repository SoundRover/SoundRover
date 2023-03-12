import React, { useState, useEffect } from 'react';
import './FactBox.css';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CircleIcon from '@mui/icons-material/Circle';
import axios from 'axios';
import { useDataLayerValue } from './DataLayer';

function FactBox() {
    const [{ spotify }, dispatch] = useDataLayerValue();
    const [currentTrack, setCurrentTrack] = useState(null);
    const [loading, setLoading] = useState(false);
    let [obj, setObj] = useState({ choices: [] });
    const [payload, setPayLoad] = useState({
        prompt: "Mario: Hi, how are you?",

        temperature: 0.5,
        n: 1,
        model: "text-davinci-003"
    });

    const getRes = () => {
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
    };

    const responseHandler = (res) => {
        if (res.status === 200) {
            setObj(res.data);
            setLoading(false);
        }
    };

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

    return (
        <div className="fact-box">
            <div className="fact-box-content">
                <ArrowCircleLeftIcon fontSize="large" className="left-fact-arrow"/>
                <p className="fact-box-text">{loading ? (
                <span>loading...</span>
              ) : (
                obj?.choices?.map((v, i) => <div>{v.text}</div>)
              )}</p>
                <ArrowCircleRightIcon fontSize="large" className="right-fact-arrow" onClick={getRes}/>
            </div>
            <div className="fact-box-pagination">
                <CircleIcon className="fact-box-circle-icon"/>
                <CircleIcon className="fact-box-circle-icon"/>
                <CircleIcon className="fact-box-circle-icon"/>
                <CircleIcon className="fact-box-circle-icon"/>
            </div>
        </div>
    );
}

export default FactBox;