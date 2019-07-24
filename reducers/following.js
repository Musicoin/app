import {RECEIVE_FOLLOWING_ARTISTS_SUCCESS} from '../constants/Actions';

export default function following(state = [], action) {
  switch (action.type) {
    case RECEIVE_FOLLOWING_ARTISTS_SUCCESS:
      if (action.artists && action.artists.length > 0) {
        if (action.skip == 0) {
          return action.artists;
        } else {
          return [...state, ...action.artists];
        }
      } else {
        if (action.skip == 0) {
          return [];
        }
        else {
          return state;
        }
      }
    default:
      return state;
  }
}