import { Favorite, MoreHoriz, PlayCircleFilled } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import './Body.css';
import { useDataLayerValue } from './DataLayer';
import Header from './Header';
import SongRow from './SongRow';
import logo from './assets/SR-transparent.png';
import SidebarOption from './SidebarOption';
import PlaylistOption from './PlaylistOption';

function Body({ activeOption }) {

    const [{ selected_music }] = useDataLayerValue();
    const [{ user }] = useDataLayerValue();

    const [{ playlists }] = useDataLayerValue();
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [showPlaylistList, setShowPlaylistList] = useState(true);
    const [playlistTracks, setPlaylistTracks] = useState([]);

    const [{ spotify }] = useDataLayerValue();

    const handlePlaylistClick = (playlist) => {
        console.log(playlist);
        setSelectedPlaylist(playlist);
        setShowPlaylistList(false);

        console.log(playlist.id);
        console.log(spotify);

        spotify.getPlaylistTracks(playlist.id).then((tracks) => {
            setPlaylistTracks(tracks.items);
        });
    };

    const playAndQueuePlaylist = async () => {
        console.log(playlistTracks);
        await spotify.play({ uris: [playlistTracks[0].track.uri], });
        for (let track = 1; track < playlistTracks.length; track++) {
            await spotify.queue(playlistTracks[track].track.uri);
        }
    };

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
                    <Header spotify={spotify} 
                    activeOption={activeOption} 
                    arrowClick={setShowPlaylistList} 
                    showPlaylistList={showPlaylistList} />
                
                    {showPlaylistList ? (
                    // Render the playlist list
                    <div className="playlist-container">
                        {playlists?.items?.map(playlist => (
                            <PlaylistOption 
                            title={playlist.name} 
                            key={playlist.id} 
                            id={playlist.id} 
                            image={playlist.images[0]?.url || null} 
                            onClick={() => handlePlaylistClick(playlist)} />
                        ))}
                    </div>
                    ) : (
                    // Render the selected playlist
                    <>
                        <div className="body__info" >
                            <img src={selectedPlaylist?.images[0].url } alt="" />
                            <div className="body__infoText">
                                <strong>PLAYLIST</strong>
                                <h2>{selectedPlaylist?.name}</h2>
                                
                                {/* Using dangerouslySetInnerHTML to display the text since React escapes 
                                special characters by default making the playlist descriptions unreadable */}
                                <p dangerouslySetInnerHTML={{__html: selectedPlaylist?.description}}></p>
                            </div>
                        </div>
                        <div className="body__songs">
                            <div className="body__icons">
                                <PlayCircleFilled className="body__shuffle" onClick={playAndQueuePlaylist} />
                                <Favorite fontSize="large" />
                                <MoreHoriz />
                            </div>
            
                            {/* List of Songs */}
                            {playlistTracks?.map(item => (
                                <SongRow track={item.track} />
                            ))}
                        </div>
                    </>
                    )}
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