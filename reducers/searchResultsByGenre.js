import {SEARCH_BY_GENRE_REQUEST, SEARCH_BY_GENRE_SUCCESS, SEARCH_BY_GENRE_FAILURE, TIP_TRACK} from '../constants/Actions';

export default function releasesByGenre(state = [], action) {
  switch (action.type) {
    case SEARCH_BY_GENRE_SUCCESS:
      return action.data ? action.data : [];
    case SEARCH_BY_GENRE_FAILURE, SEARCH_BY_GENRE_REQUEST:
      return [];
    case TIP_TRACK: {
      //update tip count in store
      return state.map((item, index) => {
        if (item.trackId !== action.trackId) {
          // This isn't the item we care about - keep it as-is
          return item;
        }

        // Otherwise, this is the one we want - return an updated value
        return {
          ...item,
          directTipCount: item.directTipCount + 1,
        };
      });
    }
    default:
      return state;
  }
}