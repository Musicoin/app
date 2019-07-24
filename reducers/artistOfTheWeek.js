import {ARTIST_OF_THE_WEEK_SUCCESS, LIKE_TRACK, TIP_TRACK, FOLLOW_ARTIST} from '../constants/Actions';

export default function artistOfTheWeek(state = null, action) {
  switch (action.type) {
    case ARTIST_OF_THE_WEEK_SUCCESS:
      return action.data.track && action.data.artist ? action.data : state;
    case TIP_TRACK: {
      //update tip count in store
      if (action.success) {
        let item = state.track;
        if (item.trackAddress === action.trackAddress) {
          return {
            ...state,
            track: {
              ...item,
              directTipCount: item.directTipCount + 1,
            },
          };
        }
      } else {
        return state;
      }
    }
    case LIKE_TRACK: {
      //update like in store
      if (action.success) {
        let item = state.track;
        if (item.trackAddress === action.trackAddress) {
          return {
            ...state,
            track: {
              ...item,
              liked: action.like,
            },
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    case FOLLOW_ARTIST: {
      //update followed property in store
      if (action.success) {
        let item = state.artist;
        if (item.artistAddress === action.artist.artistAddress) {
          return {
            ...state,
            artist: {
              ...item,
              followed: action.follow,
            },
          };
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}