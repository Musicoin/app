import {LIKE_TRACK} from '../constants/Actions';
import {fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import NavigationService from '../services/NavigationService';

function addLike(track, json, like) {
  return function(dispatch, getState) {
    //ToDo: remove this after testing
    json = {tx: true};

    let success = false;
    if (json.tx) {
      // dispatch(addAlert('success', 'Your tip has been sent successfully!', 'Thanks for supporting your favorite artists.'));
      success = true;
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please retry your tip at a later time.'));
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

  //ToDo: add like api's
  console.log(`like: ${like}`);
  return;

  // let likeTrack;
  // if(like){
  // await fetchPostFormDataJson(`v2/release/tip?email=${email}&accessToken=${token}`, params);
  // }else{

  // }
  // return likeTrack;
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
