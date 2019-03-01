import {TIP_TRACK} from '../constants/Actions';

export default function lastTipped(state = [], action) {
  switch (action.type) {
    case TIP_TRACK: {
      //update tip count in store
      if (action.success) {
        state.push(action.track);

        if (state.length > 50) {
          state.shift();
        }
        return [...state];
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}