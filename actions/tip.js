import {TIP_TRACK, ALLOW_NEXT_TIP} from '../constants/Actions';
import {TIP_TIMEOUT_MILIS} from '../constants/App';
import {fetchPostFormDataJson} from '../tools/util';
import {addAlert} from './alert';
import NavigationService from '../services/NavigationService';

function addTip(track, json, amount) {
  return function(dispatch, getState) {
    let success = false;
    if (json.tx) {
      dispatch(addAlert('success', 'Your tip has been sent successfully!', 'Thanks for supporting your favorite artists.'));
      success = true;
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please retry your tip at a later time.'));
    }
    dispatch({
      type: TIP_TRACK,
      trackAddress: track.trackAddress,
      track,
      success,
      amount,
    });
  };
}

async function tipTrackJson(trackAddress, token, email, amount) {
  let params = {
    trackAddress,
    musicoins: amount,
  };

  let tipTrack = await fetchPostFormDataJson(`v2/release/tip?email=${email}&accessToken=${token}`, params);
  return tipTrack;
}

export function tipTrack(track, amount = 1) {
  return function(dispatch, getState) {
    let {loggedIn} = getState().auth;
    if (loggedIn) {
      let {accessToken, email} = getState().auth;
      let {balance} = getState().profile;
      if (balance < amount) {
        return dispatch(addAlert('error', 'Insufficient funds', 'You don\'t have enough coins to tip this amount'));
      }
      return tipTrackJson(track.trackAddress, accessToken, email, amount).then(json => dispatch(addTip(track, json, amount)));
    } else {
      NavigationService.navigate('Profile');
    }
  };
}
