import {fetchAccessToken} from './auth';
import {SEARCH_BY_ARTIST_FAILURE, SEARCH_BY_ARTIST_REQUEST, SEARCH_BY_ARTIST_SUCCESS} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import {API_VERSION} from 'react-native-dotenv';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  let searchResults;

  if (json.success && json.releases) {
    searchResults = json.releases;
  }

  return {
    type: searchResults ? SEARCH_BY_ARTIST_SUCCESS : SEARCH_BY_ARTIST_FAILURE,
    data: searchResults,
  };
}

async function fetchSearchResultsJson(token, artistId, email) {
  var params = {
    'accessToken': token,
    'limit': 50,
    'email': email,
  };

  //ToDo: update this request to the newest api version

  let results = await fetchGetData(`release/byartist/${API_VERSION}/${artistId}?`, params);

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

      if (!results.releases[i].trackImg) {
        results.releases[i].trackImg = Layout.defaultTrackImage;
      }

      results.releases[i].origin = 'artist';
    }
    return results;
  } else {
    return false;
  }
}

export function getSearchByArtistResults(artistId) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_BY_ARTIST_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchSearchResultsJson(accessToken, artistId, email).then(json => dispatch(receiveSearchResults(json)));
  };
}
