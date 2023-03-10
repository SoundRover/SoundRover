import { Favorite, MoreHoriz, PlayCircleFilled } from '@material-ui/icons';
import React from 'react';
import './Body.css';
import { useDataLayerValue } from './DataLayer';
import Header from './Header';
import SongRow from './SongRow';

function Body({ spotify }) {

    const [{ selected_music }] = useDataLayerValue();

    return (
        <div className="body">
            <Header spotify={spotify} />

            <div className="body__info" >
                <img src={selected_music?.images[0].url } alt=""
                />
                <div className="body__infoText">
                    <strong>PLAYLIST</strong>
                    <h2>{selected_music?.name}</h2>
                    <p>{selected_music?.description}</p>
                </div>
            </div>
            <div className="body__songs">
                <div className="body__icons">
                    <PlayCircleFilled className="body__shuffle" />
                    <Favorite fontSize="large" />
                    <MoreHoriz />
                </div>

                {/* List of Songs */}
                {selected_music?.tracks.items.map(item => (
                    <>
                        <SongRow track={item.track} />
                    </>
                ))}
            </div>
        </div>
    )
}

export default Body;