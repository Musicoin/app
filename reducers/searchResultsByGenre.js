import {SEARCH_BY_GENRE_REQUEST, SEARCH_BY_GENRE_SUCCESS, SEARCH_BY_GENRE_FAILURE, TIP_TRACK} from '../constants/Actions';

export default function releasesByGenre(state = [], action) {
  switch (action.type) {
    case SEARCH_BY_GENRE_SUCCESS:
      if (action.data && action.data.length > 0) {
        if (action.skip == 0) {
          return action.data;
        } else {
          return [...state, ...action.data];
        }
      } else {
        if (action.skip == 0) {
          return [];
        }
        else {
          return state;
        }
      }
    case SEARCH_BY_GENRE_REQUEST:
      return action.skip == 0 ? [] : state;
    case SEARCH_BY_GENRE_FAILURE:
      return [];
    case TIP_TRACK: {
      //update tip count in store
      if (action.success) {
        return state.map((item, index) => {
          if (item.trackAddress !== action.trackAddress) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            ...item,
            directTipCount: item.directTipCount + 1,
          };
        });
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}