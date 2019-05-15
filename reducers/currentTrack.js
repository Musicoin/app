import {LIKE_TRACK, PLAY_TRACK, TIP_TRACK} from '../constants/Actions';

export default function currentTrack(state = null, action) {
  switch (action.type) {
    case PLAY_TRACK:
      return action.track ? action.track : state;
    case TIP_TRACK: {
      //update tip count in store
      if (action.success) {
        let item = state;
        if (item.trackAddress === action.trackAddress) {
          return {
            ...item,
            directTipCount: item.directTipCount + 1,
          };
        }
      } else {
        return state;
      }
    }
    case LIKE_TRACK: {
      //update like in store
      if (action.success) {
        let item = state;
        if (item.trackAddress === action.trackAddress) {
          return {
            ...item,
            liked: action.like,
          };
        }
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}