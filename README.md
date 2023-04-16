# soundrover
Sound Rover Application Files
## spotify-api-testing.py
Contains some demos on how to use some of the Spotipy API funcitonality.
## v1.0 changelog
- Version with somewhat working desktop application.
## v1.1 changelog
- Fixed discover_weekly --> selected_music changes
- Changed login page aesthetics
- Added framework to log out, no functionality
- Scrollable playlist list
- Playlist name updates on main body
- Fixed footer overlapping content
- Fixed footer formatting for mobile devices
- Added play/pause logic
- Added play/pause icon logic
- No longer need to start playing a song on spotify app for play/pause to work-- just need the app open
- Added prompt to open spotify app on phone if not already open
- Removed sidebar on mobile, added bottom navbar instead
## v1.2 changelog
- Shuffle, skip, repeat buttons work
- Fixed play/pause to reflect spotify play/pause state
## v1.3 changelog
- Added Song fact cards and expandable footer
- Added OpenAI API calls to generate a single song fact
## v1.3.1 changelog
- Fixes for factbox
## v.1.3.2 changelog
- added package and package-lock json files for above two versions
## v.1.3.3 changelog
- Implemented currentTrack as a global variable so it is usable in other components (like Factbox)
- Implemented factsExpanded and factsLoading as globals
## v1.4
- Factbox now allows for 4 facts to be displayed
- Buttons on factbox allow you to seek through different facts
## v.1.5
- Songs now playback by tapping them (on mobile) or double-clicking them (on desktop)
## v1.6
- Genius lyrics integration
- Fixed OpenAI API loading issue
## v1.7 
- Basic search bar working!
## v1.8
- New facts now load when song changes
- Footer component annotated and reorganized for readability
    - The "obj" variable is now called "facts"
    - Simplified useEffect() function for OpenAI
- Updated OpenAI key (old one maxed out limit)
- Fixed bug: fact arrows work going left now
## v1.9
- Changed OpenAI API calls to use "gpt-3.5-turbo" model from "text-davinci-003"
- Added functionality for bottom page buttons (Home, Search, Your Library)
- Changed layout of search
- Minor UI tweaks
## v1.10
- Added view of user's playlists in "Your Library" tab
- Clicking a playlist name allows you to view the playlist
- Clicking the large play button at the top of a playlist plays the first song and queues all remaining songs in the playlist
- Clicking the back button in a playlist view takes the user back to the list of playlists
- Fixed logic for playing songs to play songs immediately instead of queuing and then skipping to next