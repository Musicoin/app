import {fetchAccessToken, fetchReleaseDetailsJson, fetchTrackImageJson} from './index';
import {SEARCH} from '../constants/Actions';
import {fetchPostFormData} from '../tools/util';
import {API_EMAIL} from 'react-native-dotenv';

function receiveSearchResults(json) {
  console.log(json);
  const searchResults = json.data;

  return {
    type: SEARCH,
    searchResults,
  };
}

async function fetchSearchResultsJson(token, artistName) {

  var params = {
    'artistName': artistName,
  };

  let results = await fetchPostFormData(`search?email=${API_EMAIL}&accessToken=${token}&limit=2`, params);

  //ToDo: more error handling e.g. when no results are returned

  if (results.data.releases) {

    for (let i = 0; i < results.data.releases.length; i++) {
      let trackId = results.data.releases[i].pppLink;
      let releaseDetails = await fetchReleaseDetailsJson(token, trackId);
      results.data.releases[i] = {...releaseDetails.data, ...results.data.releases[i], trackId};
      let trackImgArray = results.data.releases[i].trackImg.split('/');
      let trackImg = await fetchTrackImageJson(trackImgArray[trackImgArray.length - 1]);
      results.data.releases[i].trackImg = trackImg;
    }

    return results;
  } else {
    return results;
  }
}

export function getSearchResults(artistName) {
  return function(dispatch, getState) {
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
