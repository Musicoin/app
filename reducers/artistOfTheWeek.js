import {ARTIST_OF_THE_WEEK_SUCCESS} from '../constants/Actions';

export default function artistOfTheWeek(state = null, action) {
  switch (action.type) {
    case ARTIST_OF_THE_WEEK_SUCCESS:
      return action.data.track && action.data.artist ? action.data : state;
    default:
      return state;
  }
}