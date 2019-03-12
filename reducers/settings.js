import {TOGGLE_SHUFFLE, TOGGLE_REPEAT, TOGGLE_PLAYER_MODE, TIP_TRACK} from '../constants/Actions';

export default function settings(state = {shuffle: false, repeat: false, bigPlayer: false, tipAmount: 10}, action) {
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
    case TIP_TRACK: {
      if (action.amount > 1) {
        return {...state, tipAmount: action.amount};
      } else {
        return state;
      }
    }
    default:
      return state;
  }
}
