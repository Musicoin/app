import {fetchAccessToken, fetchReleaseDetailsJson, fetchTrackImageJson} from './index';
import {SEARCH_FAILURE, SEARCH_REQUEST, SEARCH_SUCCESS} from '../constants/Actions';
import {fetchPostFormData} from '../tools/util';
import {API_EMAIL} from 'react-native-dotenv';
import Layout from '../constants/Layout';

function receiveSearchResults(json) {
  const searchResults = json.data;

  return {
    type: json? SEARCH_SUCCESS: SEARCH_FAILURE,
    searchResults,
  };
}

async function fetchSearchResultsJson(token, artistName) {

  var params = {
    'artistName': artistName,
  };

  let results = await fetchPostFormData(`search?email=${API_EMAIL}&accessToken=${token}&limit=2`, params);

  if (results.success && results.data) {

    for (let i = 0; i < results.data.releases.length; i++) {
      let trackPartArray = results.data.releases[i].link.split('/');
      let trackId = trackPartArray[trackPartArray.length - 1];
      let releaseDetails = await fetchReleaseDetailsJson(token, trackId);
      results.data.releases[i] = {...releaseDetails.data, ...results.data.releases[i], trackId};
      if (results.data.releases[i].trackImg) {
        let trackImgArray = results.data.releases[i].trackImg.split('/');
        let trackImg = await fetchTrackImageJson(trackImgArray[trackImgArray.length - 1]);
        results.data.releases[i].trackImg = trackImg;
      } else {
        results.data.releases[i].trackImg = Layout.defaultTrackImage;
      }
      if(!results.data.releases[i].genres){
        results.data.releases[i].genres = [];
      }

      if(!results.data.releases[i].directTipCount){
        results.data.releases[i].directTipCount = 0;
      }

      if(!results.data.releases[i].directPlayCount){
        results.data.releases[i].directPlayCount = 0;
      }
    }

    return results;
  } else {
    return false;
  }
}

export function getSearchResults(artistName) {
  return function(dispatch, getState) {
    dispatch({type: SEARCH_REQUEST})
    let accessToken = getState().accessToken;
    let diff = (Math.abs(accessToken.receivedAt - Date.now())) / 1000 / 60;
    if (diff >= 58) {
      // get a new token
      dispatch(fetchAccessToken()).then(() => {return fetchSearchResultsJson(getState().accessToken.token, artistName).then(json => dispatch(receiveSearchResults(json)));});

    } else {
      return fetchSearchResultsJson(accessToken.token, artistName).then(json => dispatch(receiveSearchResults(json)));
    }
  };
}
