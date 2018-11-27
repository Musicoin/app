import {SEARCH_FAILURE, SEARCH_SUCCESS} from '../constants/Actions';

export default function releases(state = {user: null, releases: []}, action) {
  switch (action.type) {
    case SEARCH_SUCCESS:
      return action.searchResults.user ? action.searchResults : state;
    case SEARCH_FAILURE:
      return {user: null, releases: []};
    default:
      return state;
  }
}