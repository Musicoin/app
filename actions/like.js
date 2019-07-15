import {LIKE_TRACK} from '../constants/Actions';
import {fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import NavigationService from '../services/NavigationService';

function addLike(track, json, like) {
  return function(dispatch, getState) {
    //ToDo: remove this after testing
    json = {tx: true};

    let success = false;
    if (like) {
      if (json && json.success) {
        dispatch(addAlert('success', 'Your like has been sent successfully!', 'Thanks for supporting your favorite artists.'));
        success = true;
      } else {
        dispatch(addAlert('error', 'Something went wrong', 'Please retry at a later time.'));
      }
    } else {
      if (json && json.success) {
        dispatch(addAlert('success', '', 'Your unlike has been sent successfully!'));
        success = true;
      } else {
        dispatch(addAlert('error', 'Something went wrong', 'Please retry at a later time.'));
      }
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
      return likeTrackJson(track.trackAddress, accessToken, email, like).then(json => dispatch(addLike(track, json, like)));
    } else {
      NavigationService.navigate('Profile');
    }
  };
}
