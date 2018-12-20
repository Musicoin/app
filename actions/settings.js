import {TOGGLE_REPEAT, TOGGLE_SHUFFLE, TOGGLE_PLAYER_MODE} from '../constants/Actions';

export function toggleRepeat() {
  return function(dispatch) {
    return dispatch({type: TOGGLE_REPEAT});
  };
}

export function toggleShuffle() {
  return function(dispatch) {
    return dispatch({type: TOGGLE_SHUFFLE});
  };
}

export function togglePlayerMode() {
  return function(dispatch) {
    return dispatch({type: TOGGLE_PLAYER_MODE});
  };
}
