export const initialState = {
  spotify: null,
  user: null,
  playlists: [],
  currentTrack: null,
  selected_music: null,
  top_artists: null,
  isPlaying: false,
  isShuffling: false,
  repeatMode: "off",
  factsExpanded: false,
  factsLoading: false,
  item: null,
  // remove after finishing the develoment
  // token: "BQBn48goHMW31caaepALlNxTEdTjv9nFzcxsINk9JJWda9yA-4P25LC9lwQxtSyXG5bOr5LDz3MR_zq7GkZ1BIwyGh1fcH9Awu8dGkU4ClH-96Wa4SjB8COhl1_oOVmAmGJyqBJ_L4Sw5TFXF9AtMkWmUJvuIx4fks7tNyrsSvKp-RdT",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "SET_SPOTIFY":
      return {
        ...state,
        spotify: action.spotify,
      };

    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "SET_PLAYLISTS":
      return {
        ...state,
        playlists: action.playlists,
      };
    
    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentTrack: action.currentTrack,
      };

    case "SET_SELECTED_MUSIC":
      return {
        ...state,
        selected_music: action.selected_music,
      };

    case "SET_TOP_ARTISTS":
      return {
        ...state,
        top_artists: action.top_artists,
      };
    
    case "SET_PLAYING":
      return {
        ...state,
        isPlaying: action.isPlaying
      };

    case "SET_SHUFFLE":
      return {
        ...state,
        isShuffling: action.isShuffling
      };

    case "SET_REPEAT":
      return {
        ...state,
        repeatMode: action.repeatMode
      };

    case "SET_FACTS_EXPANDED":
      return {
        ...state,
        factsExpanded: action.factsExpanded
      };

    case "SET_FACTS_LOADING":
      return {
        ...state,
        factsLoading: action.factsLoading
      };

    case "SET_TOKEN":
      return {
        ...state,
        token: action.token,
      };

    case "SET_ITEM":
      return {
        ...state,
        item: action.item,
      };

    default:
      return state;
  }
};

export default reducer;