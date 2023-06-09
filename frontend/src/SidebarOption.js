import React from 'react';
import './SidebarOption.css'
import './SidebarOption.css';
import { useDataLayerValue } from './DataLayer';

// Parameters: title, icon, and playlist id
// Only playlists will be passed 'id'
function SidebarOption({ title, Icon, id, onOptionClick }) {
    const [ { spotify }, dispatch] = useDataLayerValue();

    // Event handler for clicking a 'sidebarOption'
    const handleClick = () => {
        console.log(`Sidebar Option ${title} clicked!`);
        onOptionClick(title);
        
        // Only run this code for playlists (if 'id' has been passed)
        if (spotify && id){
            console.log("Playlist ID: ", id)
            
            // Update the selected playlist
            spotify.getPlaylist(id).then(response => 
                dispatch({
                  type: "SET_SELECTED_MUSIC",
                  selected_music: response
                })
              );
        }
        
      }

    return (
        <div className="sidebarOption" onClick={handleClick}>
            {Icon && <Icon className="sidebarOption__icon" />}
            {Icon ? <h4>{title}</h4> : <p>{title}</p>}
        </div>
    )
}

export default SidebarOption;
