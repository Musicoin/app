import {LIKE_TRACK, RECEIVE_LIKED_TRACKS_SUCCESS, TIP_TRACK} from '../constants/Actions';

export default function liked(state = [], action) {
  switch (action.type) {
    case RECEIVE_LIKED_TRACKS_SUCCESS:
      if (action.releases && action.releases.length > 0) {
        if (action.skip == 0) {
          return action.releases;
        } else {
          return [...state, ...action.releases];
        }
      } else {
        if (action.skip == 0) {
          return [];
        }
        else {
          return state;
        }
      }
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
    case LIKE_TRACK: {
      //update like in store
      if (action.success) {
        return state.map((item, index) => {
          if (item.trackAddress !== action.trackAddress) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            ...item,
            liked: action.like,
          };
        });
      }else{
        return state;
      }
    }
    default:
      return state;
  }
}