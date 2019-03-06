import {SEARCH_BY_GENRE_FAILURE, SEARCH_BY_GENRE_REQUEST, SEARCH_BY_GENRE_SUCCESS} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import Layout from '../constants/Layout';
import {GENERAL_API_LIMIT} from '../constants/App';

function receiveSearchResults(json, skip) {
  let searchResults;

  if (json.tracks) {
    searchResults = json.tracks;
  }

  return {
    type: searchResults ? SEARCH_BY_GENRE_SUCCESS : SEARCH_BY_GENRE_FAILURE,
    data: searchResults,
    skip,
  };
}

async function fetchSearchResultsJson(token, genre, email, skip) {
  var params = {
    'genre': genre,
    'accessToken': token,
    'email': email,
    'limit': GENERAL_API_LIMIT,
    skip,
  };

  let results = await fetchGetData(`v1/release/bygenre?`, params);

  if (results.tracks != []) {

    for (let i = 0; i < results.tracks.length; i++) {

      if (!results.tracks[i].genres) {
        results.tracks[i].genres = [];
      }

      if (!results.tracks[i].directTipCount) {
        results.tracks[i].directTipCount = 0;
      }

      if (!results.tracks[i].directPlayCount) {
        results.tracks[i].directPlayCount = 0;
      }

      if (!results.tracks[i].trackImg) {
        results.tracks[i].trackImg = Layout.defaultTrackImage;
      }

      results.tracks[i].origin = 'genre';
    }
    return results;
  } else {
    return false;
  }
}

export function getSearchByGenreResults(genre, skip = 0) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_BY_GENRE_REQUEST, skip});
    let {accessToken, email} = getState().auth;
    return fetchSearchResultsJson(accessToken, genre, email, skip).then(json => dispatch(receiveSearchResults(json, skip)));
  };
}
