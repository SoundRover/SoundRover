import React from 'react';
import './Sidebar.css';
import SidebarOption from './SidebarOption';
import HomeIcon from "@material-ui/icons/Home";
import SearchIcon from "@material-ui/icons/Search";
import LibraryMusicIcon from "@material-ui/icons/LibraryMusic";
import { useDataLayerValue } from './DataLayer';

function Sidebar({onOptionClick}) {
  const [{ playlists }] = useDataLayerValue();
  const isMobile = window.innerWidth < 768; // define a threshold for mobile devices
  console.log("🥳",playlists);

  if (isMobile) {
    return (
      <div className="sidebar">
        <SidebarOption Icon={HomeIcon} />
        <SidebarOption Icon={SearchIcon}/>
        <SidebarOption Icon={LibraryMusicIcon}/>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <img 
        className="sidebar__logo"
        src="https://getheavy.com/wp-content/uploads/2019/12/spotify2019-830x350.jpg" 
        alt=""
      />
      <SidebarOption Icon={HomeIcon} title="Home" onOptionClick={onOptionClick} />
      <SidebarOption Icon={SearchIcon} title="Search" onOptionClick={onOptionClick} />
      <SidebarOption Icon={LibraryMusicIcon} title="Your Library" onOptionClick={onOptionClick} />

      <br/>
      <strong className="sidebar__title">PLAYLISTS</strong>
      <hr />

      <div className="playlist-container">
        {playlists?.items?.map(playlist => (
          <SidebarOption title={playlist.name} key={playlist.id} id={playlist.id} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
