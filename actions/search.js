import {fetchAccessToken} from './auth';
import {fetchReleaseDetailsJson, fetchTrackImageJson} from './release';
import {SEARCH_FAILURE, SEARCH_REQUEST, SEARCH_SUCCESS} from '../constants/Actions';
import {fetchPostFormData} from '../tools/util';
import {API_EMAIL, API_VERSION} from 'react-native-dotenv';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  let searchResults;

  if (json.releases || json.artists) {
    searchResults = {releases: json.releases, artists: json.artists};
  }

  return {
    type: searchResults ? SEARCH_SUCCESS : SEARCH_FAILURE,
    searchResults,
  };
}

async function fetchSearchResultsJson(token, keyword) {

  var params = {
    'keyword': keyword,
    'limit': 20
  };

  let results = await fetchPostFormData(`search/${API_VERSION}?email=${API_EMAIL}&accessToken=${token}`, params);

  if (results.success && results.releases != []) {

    for (let i = 0; i < results.releases.length; i++) {
      if (!results.releases[i].genres) {
        results.releases[i].genres = [];
      }

      if (!results.releases[i].directTipCount) {
        results.releases[i].directTipCount = 0;
      }

      if (!results.releases[i].directPlayCount) {
        results.releases[i].directPlayCount = 0;
      }

      if(!results.releases[i].trackImg){
        results.releases[i].trackImg = Layout.defaultTrackImage;
      }

      results.releases[i].origin = 'search';
    }

    return results;
  } else {
    return false;
  }
}

export function getSearchResults(keyword) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_REQUEST});
    let accessToken = getState().accessToken;
    let diff = (Math.abs(accessToken.receivedAt - Date.now())) / 1000 / 60;
    if (diff >= 58) {
      // get a new token
      dispatch(fetchAccessToken()).then(() => {return fetchSearchResultsJson(getState().accessToken.token, keyword).then(json => dispatch(receiveSearchResults(json)));});

    } else {
      return fetchSearchResultsJson(accessToken.token, keyword).then(json => dispatch(receiveSearchResults(json)));
    }
  };
}
