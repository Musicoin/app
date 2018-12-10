import {PLAY_TRACK} from '../constants/Actions';

export function playTrack(track, addToLastPlayed = true) {
  return {
    type: PLAY_TRACK,
    track,
    addToLastPlayed
  };
}