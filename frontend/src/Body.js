import { Favorite, MoreHoriz, PlayCircleFilled } from '@material-ui/icons';
import React from 'react';
import './Body.css';
import { useDataLayerValue } from './DataLayer';
import Header from './Header';
import SongRow from './SongRow';
import logo from './assets/SR-transparent.png'

function Body({ spotify, activeOption }) {

    const [{ selected_music }] = useDataLayerValue();
    const [{ user }] = useDataLayerValue();

    const renderContent = () => {
        switch (activeOption) {
            case 'Home':
                return (
                    <div className="body">
                        <Header spotify={spotify} activeOption={activeOption} />
                        <h1 className="home_header">Welcome to Sound Rover, {user?.display_name}!</h1>
                        <img src={logo} className="home_logo"/>
                    </div>
                );
            case 'Search':
                return (
                    <div className="body">
                        <Header spotify={spotify} activeOption={activeOption} />
                    </div>
                );
            case 'Your Library':
                return (
                <div className="body">
                    <Header spotify={spotify} activeOption={activeOption} />
        
                    <div className="body__info" >
                        <img src={selected_music?.images[0].url } alt=""
                        />
                        <div className="body__infoText">
                            <strong>PLAYLIST</strong>
                            <h2>{selected_music?.name}</h2>
                            
                            {/* Using dangerouslySetInnerHTML to display the text since React escapes 
                            special characters by default making the playlist descriptions unreadable */}
                            <p dangerouslySetInnerHTML={{__html: selected_music?.description}}></p>
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
                            <SongRow track={item.track} />
                        ))}
                    </div>
                </div>
            );
            default:
                return <div>No content available</div>;
        }
    }

    return (
        <>
            {renderContent()}
        </>
    )
}

export default Body;