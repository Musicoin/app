import {SEARCH_REQUEST, SEARCH_FAILURE, SEARCH_SUCCESS, TIP_TRACK} from '../constants/Actions';

export default function releases(state = {user: null, releases: []}, action) {
  switch (action.type) {
    case SEARCH_SUCCESS:
      return action.searchResults.user ? action.searchResults : state;
    case SEARCH_FAILURE, SEARCH_REQUEST:
      return {user: null, releases: []};
    case TIP_TRACK: {
      //update tip count in store
      console.log(state);
      return {
        ...state,
        releases: state.releases.map((item, index) => {
          if (item.trackId !== action.trackId) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            ...item,
            directTipCount: item.directTipCount + 1,
          };
        }),
      };
    }
    default:
      return state;
  }
}