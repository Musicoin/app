import {PLAY_TRACK, TIP_TRACK, LIKE_TRACK} from '../constants/Actions';

export default function lastPlayed(state = [], action) {
  switch (action.type) {
    case PLAY_TRACK:
      if (action.addToLastPlayed) {
        state.push(action.track);
      } else {
        state.pop();
      }
      if (state.length > 50) {
        state.shift();
      }
      return [...state];
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
      }else{
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