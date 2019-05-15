import {LIKE_TRACK, TIP_TRACK} from '../constants/Actions';

export default function lastTipped(state = [], action) {
  switch (action.type) {
    case TIP_TRACK: {
      if (action.success) {
        state.push(action.track);

        if (state.length > 50) {
          state.shift();
        }
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