import {fetchAccessToken} from './auth';
import {RECEIVE_NEW_RELEASES_REQUEST, RECEIVE_NEW_RELEASES_SUCCESS, RECEIVE_NEW_RELEASES_FAILURE} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import Layout from '../constants/Layout';
import {API_VERSION} from 'react-native-dotenv';

function receiveReleases(json) {
  let releases;
  if (json.releases) {
    releases = json.releases;
  }

  return {
    type: releases ? RECEIVE_NEW_RELEASES_SUCCESS : RECEIVE_NEW_RELEASES_FAILURE,
    releases,
  };
}

async function fetchReleasesJson(token) {

  var params = {
    'accessToken': token,
    'limit': '20',
  };

  let results = await fetchGetData(`release/recent/${API_VERSION}?`, params);

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

      results.releases[i].origin = 'new';
    }
    return results;
  } else {
    return false;
  }
}

export async function fetchReleaseDetailsJson(token, trackId) {
  var params = {
    'accessToken': token,
  };

  let releaseDetails = await fetchGetData(`release/details/${trackId}?`, params);
  return releaseDetails;
}

export function fetchReleases() {
  return function(dispatch, getState) {
    dispatch({type: RECEIVE_NEW_RELEASES_REQUEST});
    let accessToken = getState().accessToken;
    let diff = (Math.abs(accessToken.receivedAt - Date.now())) / 1000 / 60;
    if (diff >= 58) {
      // get a new token
      dispatch(fetchAccessToken()).then(() => {return fetchReleasesJson(getState().accessToken.token).then(json => dispatch(receiveReleases(json)));});

    } else {
      return fetchReleasesJson(accessToken.token).then(json => dispatch(receiveReleases(json)));
    }
  };
}

export async function fetchTrackImageJson(imageId) {
  try {
    return fetch(`https://musicoin.org/i2i/${imageId}`, {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
      },
    }).then(response => {
      try {
        if (response.ok) {
          let result = response.json();
          return result;
        } else {
          console.log(response);
          return false;
        }
      } catch (e) {
        console.log(response);
        return false;
      }
    }).catch(e => {
      console.log(e);
      return false;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
}