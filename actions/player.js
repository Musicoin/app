import {PLAY_TRACK} from '../constants/Actions';

export function playTrack(track) {
  return {
    type: PLAY_TRACK,
    track,
  };
}