import {SEARCH_REQUEST, SEARCH_FAILURE, SEARCH_SUCCESS, TIP_TRACK} from '../constants/Actions';

export default function releases(state = {artists: [], releases: []}, action) {
  switch (action.type) {
    case SEARCH_SUCCESS:
      let {releases, artists} = action.searchResults;
      return releases || artists ? {releases, artists} : state;
    case SEARCH_FAILURE, SEARCH_REQUEST:
      return {artists:[], releases: []};
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
    default:
      return state;
  }
}