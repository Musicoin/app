import {SEARCH_REQUEST, SEARCH_FAILURE, SEARCH_SUCCESS, TIP_TRACK, LIKE_TRACK, FOLLOW_ARTIST} from '../constants/Actions';

export default function releases(state = {artists: [], releases: []}, action) {
  switch (action.type) {
    case SEARCH_SUCCESS:
      let {releases, artists} = action.searchResults;
      return releases || artists ? {releases, artists} : state;
    case (SEARCH_FAILURE, SEARCH_REQUEST):
      return {artists: [], releases: []};
    case TIP_TRACK: {
      //update tip count in store
      if (action.success) {
        return {
          ...state,
          releases: state.releases.map((item, index) => {
            if (item.trackAddress !== action.trackAddress) {
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
      } else {
        return state;
      }
    }
    case LIKE_TRACK: {
      //update like in store
      if (action.success) {
        return {
          ...state,
          releases: state.releases.map((item, index) => {
            if (item.trackAddress !== action.trackAddress) {
              // This isn't the item we care about - keep it as-is
              return item;
            }

            // Otherwise, this is the one we want - return an updated value
            return {
              ...item,
              directTipCount: action.like,
            };
          }),
        };
      } else {
        return state;
      }
    }
    case FOLLOW_ARTIST: {
      //update like in store
      if (action.success) {
        return {
          ...state,
          artists: state.artists.map((item, index) => {
            if (item.profileAddress !== action.artist.profileAddress) {
              // This isn't the item we care about - keep it as-is
              return item;
            }

            // Otherwise, this is the one we want - return an updated value
            return {
              ...item,
              followed: action.follow,
            };
          }),
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}