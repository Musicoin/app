import {LIKE_TRACK, RECEIVE_LIKED_TRACKS_FAILURE, RECEIVE_LIKED_TRACKS_REQUEST, RECEIVE_LIKED_TRACKS_SUCCESS} from '../constants/Actions';
import {fetchGetData, fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import NavigationService from '../services/NavigationService';
import {GENERAL_API_LIMIT} from '../constants/App';
import Layout from '../constants/Layout';

function addLike(track, json, like) {
  return function(dispatch, getState) {

    let success = false;
    if (json && json.success) {
      success = true;
      if (like) {
        dispatch(addAlert('info', '', `You favorited ${track.title}`));
      } else {
        dispatch(addAlert('info', '', `You unfavorited ${track.title}`));
      }
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please retry at a later time.'));
    }

    return dispatch({
      type: LIKE_TRACK,
      trackAddress: track.trackAddress,
      success,
      like,
    });
  };
}

async function likeTrackJson(trackAddress, token, email, like) {
  let params = {
    trackAddress,
  };

  if (like) {
    let likeTrack = await fetchPostFormDataJson(`v1/user/like?email=${email}&accessToken=${token}`, params);
    console.log(likeTrack);
    return likeTrack;
  } else {
    let likeTrack = await fetchPostFormDataJson(`v1/user/unlike?email=${email}&accessToken=${token}`, params);
    console.log(likeTrack);
    return likeTrack;
  }
}

export function likeTrack(track, like) {
  return function(dispatch, getState) {
    let {loggedIn} = getState().auth;
    if (loggedIn) {
      let {accessToken, email} = getState().auth;
      let {balance} = getState().profile;
      if (like && balance < 1) {
        return dispatch(addAlert('error', 'Insufficient funds', 'You don\'t have enough coins to like this track'));
      }
      return likeTrackJson(track.trackAddress, accessToken, email, like).then(json => dispatch(addLike(track, json, like))).then(() => dispatch(fetchLikedReleases(0)));
    } else {
      NavigationService.navigate('Profile');
    }
  };
}

function receiveLikedReleases(json, skip) {
  let releases = [];
  if (json.success) {
    releases = json.data;
  }

  return {
    type: releases ? RECEIVE_LIKED_TRACKS_SUCCESS : RECEIVE_LIKED_TRACKS_FAILURE,
    releases,
    skip,
  };
}

async function fetchLikedReleasesJson(token, email, skip) {
  var params = {
    'accessToken': token,
    'email': email,
    'limit': GENERAL_API_LIMIT,
    skip,
  };

  let results = await fetchGetData(`v1/user/liking?`, params);

  if (results.success && results.data) {

    for (let i = 0; i < results.data.length; i++) {

      if (!results.data[i].genres) {
        results.data[i].genres = [];
      }

      if (!results.data[i].directTipCount) {
        results.data[i].directTipCount = 0;
      }

      if (!results.data[i].directPlayCount) {
        results.data[i].directPlayCount = 0;
      }

      if (!results.data[i].trackImg) {
        results.data[i].trackImg = Layout.defaultTrackImage;
      }

      results.data[i].liked = true;

      results.data[i].origin = 'liked';
    }
    return results;
  } else {
    return false;
  }
}

export function fetchLikedReleases(skip = 0) {
  return function(dispatch, getState) {
    dispatch({type: RECEIVE_LIKED_TRACKS_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchLikedReleasesJson(accessToken, email, skip).then(json => dispatch(receiveLikedReleases(json, skip)));
  };
}