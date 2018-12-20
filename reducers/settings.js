import {TOGGLE_SHUFFLE, TOGGLE_REPEAT, TOGGLE_PLAYER_MODE} from '../constants/Actions';

export default function settings(state = {shuffle: false, repeat: false, bigPlayer: false}, action) {
  switch (action.type) {
    case TOGGLE_SHUFFLE: {
      return {...state, shuffle: !state.shuffle};
    }
    case TOGGLE_REPEAT: {
      return {...state, repeat: !state.repeat};
    }
    case TOGGLE_PLAYER_MODE: {
      return {...state, bigPlayer: !state.bigPlayer};
    }
    default:
      return state;
  }
}
