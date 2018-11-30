import {ADD_TO_QUEUE, REMOVE_FROM_QUEUE} from '../constants/Actions';

export function addToQueue(track) {
  return {
    type: ADD_TO_QUEUE,
    track,
  };
}

export function removeFromQueue(index) {
  return {
    type: REMOVE_FROM_QUEUE,
    index,
  };
}