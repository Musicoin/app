import {SEARCH} from '../constants/Actions';

export default function releases(state = null, action) {
  switch (action.type) {
    case SEARCH:
      return action.searchResults ? action.searchResults : state;
    default:
      return state;
  }
}