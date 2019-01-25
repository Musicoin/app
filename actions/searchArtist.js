import {fetchAccessToken} from './auth';
import {SEARCH_BY_ARTIST_FAILURE, SEARCH_BY_ARTIST_REQUEST, SEARCH_BY_ARTIST_SUCCESS} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import {API_VERSION} from 'react-native-dotenv';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  let searchResults;

  if (json.tracks) {
    searchResults = json.tracks;
  }

  return {
    type: searchResults ? SEARCH_BY_ARTIST_SUCCESS : SEARCH_BY_ARTIST_FAILURE,
    data: searchResults,
  };
}

async function fetchSearchResultsJson(token, artistAddress, email) {
  var params = {
    'accessToken': token,
    'limit': 50,
    'email': email,
    artistAddress
  };

  let results = await fetchGetData(`${API_VERSION}/release/byartist?`, params);

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

      results.tracks[i].origin = 'artist';
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
