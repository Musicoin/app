import {SEARCH_FAILURE, SEARCH_REQUEST, SEARCH_SUCCESS} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  let searchResults;

  if (json.tracks || json.artists) {
    searchResults = {releases: json.tracks, artists: json.artists};
  }

  return {
    type: searchResults ? SEARCH_SUCCESS : SEARCH_FAILURE,
    searchResults,
  };
}

async function fetchSearchResultsJson(token, keyword, email) {
  var params = {
    'accessToken': token,
    'email': email,
    'keyword': keyword,
    'limit': 20,
    'skip': 0,
  };

  let results = await fetchGetData(`v2/search?`, params);

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

      results.tracks[i].origin = 'search';
    }

    return results;
  } else {
    return false;
  }
}

export function getSearchResults(keyword) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchSearchResultsJson(accessToken, keyword, email).then(json => dispatch(receiveSearchResults(json)));
  };
}
