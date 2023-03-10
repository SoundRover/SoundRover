import React, { useState, useEffect } from 'react';
import Body from './Body';
import './Player.css';
import Sidebar from './Sidebar';
import Footer from './Footer';

function Player() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsDesktop(false);
      } else {
        setIsDesktop(true);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="player">
      <div className="player__body">
        {isDesktop && <Sidebar />}
        <Body />
      </div>
      <Footer />
    </div>
  );
}

export default Player;
