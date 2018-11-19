import {PLAY_TRACK} from '../constants/Actions';

export default function currentTrack(state = null, action) {
  switch (action.type) {
    case PLAY_TRACK:
      return action.track;
    default:
      return state;
  }
}