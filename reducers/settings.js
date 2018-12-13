import {TOGGLE_SHUFFLE, TOGGLE_REPEAT} from '../constants/Actions';

export default function settings(state = {shuffle: false, repeat: false}, action) {
  switch (action.type) {
    case TOGGLE_SHUFFLE: {
      state.shuffle = !state.shuffle;
      return state;
    }
    case TOGGLE_REPEAT:
      state.repeat = !state.repeat;
      return state;
    default:
      return state;
  }
}
