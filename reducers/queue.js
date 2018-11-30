import {ADD_TO_QUEUE, REMOVE_FROM_QUEUE} from '../constants/Actions';

export default function queue(state = [], action) {
  switch (action.type) {
    case ADD_TO_QUEUE:
      action.track.origin = 'queue';
      let track = {...action.track, queueId: action.track.trackId + Math.floor((Math.random() * 1000000) + 1)};
      state.push(track);
      return state;
    case REMOVE_FROM_QUEUE:
        let filteredState = state.filter(function(value, index, arr) {
          return value.queueId !== action.index;
        });
        return filteredState;
    default:
      return state;
  }
}