import {TOGGLE_SHUFFLE, TOGGLE_REPEAT} from '../constants/Actions';

export default function settings(state = {shuffle: false, repeat: false}, action) {
  switch (action.type) {
    case TOGGLE_SHUFFLE: {
      return {...state, shuffle: !state.shuffle};
    }
    case TOGGLE_REPEAT:
      return {...state, repeat: !state.repeat};
    default:
      return state;
  }
}
