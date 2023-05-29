# Sound Rover

Sound Rover is a music player that presents interesting song facts and lyrics about the currently playing song to create a more interactive listening experience. Sound Rover works by...

1. connecting to your Spotify library and conducting music playback via the Spotify Web API
2. collecting information about the current playing song from Wikipedia
3. extracting interesting facts from the Wikipedia content and rephrasing for better readability using OpenAI's GPT-3.5

We combine the linguistic synthesizing capabilities of large language models with more trusted sources of information about artists.  

**Team Members**: Andrew Mastruserio, Benny Craig, Noah McCreery, and Ruizhen Hu

**Designed for EECS 440: Mobile App Development** at the University of Michigan. App concept design  by Benny Craig

# Application Files
- spotify-api-testing.py
    - Contains demos on how to use the Spotipy API funcitonality

# Version History
- v1.0
    - Version with somewhat working desktop application.
- v1.1
    - Fixed discover_weekly --> selected_music changes
    - Changed login page aesthetics
    - Added framework to log out, no functionality
    - Scrollable playlist list
    - Playlist name updates on main body
    - Fixed footer overlapping content
    - Fixed footer formatting for mobile devices
    - Added play/pause logic
    - Added play/pause icon logichttps://github.com/SoundRover/soundrover.git
    - No longer need to start playing a song on spotify app for play/pause to work-- just need the app open
    - Added prompt to open spotify app on phone if not already open
    - Removed sidebar on mobile, added bottom navbar instead
- v1.2
    - Shuffle, skip, repeat buttons work
    - Fixed play/pause to reflect spotify play/pause state
- v1.3
    - Added Song fact cards and expandable footer
    - Added OpenAI API calls to generate a single song fact
- v1.3.1
    - Fixes for factbox
- v.1.3.2
    - added package and package-lock json files for above two versions
- v.1.3.3
    - Implemented currentTrack as a global variable so it is usable in other components (like Factbox)
    - Implemented factsExpanded and factsLoading as globals
- v1.4
    - Factbox now allows for 4 facts to be displayed
    - Buttons on factbox allow you to seek through different facts
- v.1.5
    - Songs now playback by tapping them (on mobile) or double-clicking them (on desktop)
- v1.6
    - Genius lyrics integration
    - Fixed OpenAI API loading issue
- v1.7 
    - Basic search bar working!
- v1.8
    - New facts now load when song changes
    - Footer component annotated and reorganized for readability
    - The "obj" variable is now called "facts"
    - Simplified useEffect() function for OpenAI
    - Updated OpenAI key (old one maxed out limit)
    - Fixed bug: fact arrows work going left now
- v1.9
    - Changed OpenAI API calls to use "gpt-3.5-turbo" model from "text-davinci-003"
    - Added functionality for bottom page buttons (Home, Search, Your Library)
    - Changed layout of search
    - Minor UI tweaks
- v1.10
    - Added view of user's playlists in "Your Library" tab
    - Clicking a playlist name allows you to view the playlist
    - Clicking the large play button at the top of a playlist plays the first song and queues all remaining songs in the playlist
    - Clicking the back button in a playlist view takes the user back to the list of playlists
    - Fixed logic for playing songs to play songs immediately instead of queuing and then skipping to next
- v1.10.1
    - Added openai package dependency