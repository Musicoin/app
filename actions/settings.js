import {TOGGLE_REPEAT, TOGGLE_SHUFFLE} from '../constants/Actions';

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
