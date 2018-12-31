import {ADD_TO_QUEUE, REMOVE_FROM_QUEUE, TIP_TRACK} from '../constants/Actions';

export default function queue(state = [], action) {
  switch (action.type) {
    case ADD_TO_QUEUE:
      action.track.origin = 'queue';
      let track = {...action.track, queueId: action.track.trackAddress + Math.floor((Math.random() * 1000000) + 1)};
      return [...state, track];
    case TIP_TRACK: {
      //update tip count in store
      if (action.success) {
        return state.map((item, index) => {
          if (item.trackAddress !== action.trackAddress) {
            // This isn't the item we care about - keep it as-is
            return item;
          }

          // Otherwise, this is the one we want - return an updated value
          return {
            ...item,
            directTipCount: item.directTipCount + 1,
          };
        });
      }else{
        return state;
      }
    }
    case REMOVE_FROM_QUEUE:
        let filteredState = state.filter(function(value, index, arr) {
          return value.queueId !== action.index;
        });
        return filteredState;
    default:
      return state;
  }
}