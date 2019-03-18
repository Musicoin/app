import {RECEIVE_NEW_RELEASES_REQUEST, RECEIVE_NEW_RELEASES_SUCCESS, RECEIVE_NEW_RELEASES_FAILURE} from '../constants/Actions';
import {fetchGetData} from '../tools/util';
import Layout from '../constants/Layout';
import {GENERAL_API_LIMIT} from '../constants/App';

function receiveReleases(json, skip) {
  let releases;
  if (json.tracks) {
    releases = json.tracks;
  }

  return {
    type: releases ? RECEIVE_NEW_RELEASES_SUCCESS : RECEIVE_NEW_RELEASES_FAILURE,
    releases,
    skip,
  };
}

async function fetchReleasesJson(token, email, skip) {
  var params = {
    'accessToken': token,
    'email': email,
    'limit': GENERAL_API_LIMIT,
    skip
  };

  let results = await fetchGetData(`v1/release/recent?`, params);

  if (results && results.tracks != []) {

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

      results.tracks[i].origin = 'new';
    }
    return results;
  } else {
    return false;
  }
}

export function fetchReleases(skip = 0) {
  return function(dispatch, getState) {
    dispatch({type: RECEIVE_NEW_RELEASES_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchReleasesJson(accessToken, email, skip).then(json => dispatch(receiveReleases(json, skip)));
  };
}