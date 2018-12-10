import {PLAY_TRACK} from '../constants/Actions';

export default function lastPlayed(state = [], action) {
  switch (action.type) {
    case PLAY_TRACK:
      if (action.addToLastPlayed) {
        state.push(action.track);
      } else {
        state.pop();
      }
      if (state.length > 10) {
        state.shift();
      }
      return state;
    default:
      return state;
  }
}