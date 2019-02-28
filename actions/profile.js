import {PROFILE_REQUEST, PROFILE_SUCCESS, PROFILE_FAILURE} from '../constants/Actions';
import {fetchGetData} from '../tools/util';

function receiveProfile(json) {
  console.log(json);
  let data;
  if (json.user) {
    data = json.user;
  }

  return {
    type: data ? PROFILE_SUCCESS : PROFILE_FAILURE,
    data,
  };
}

async function fetchProfileJson(token, email) {
  var params = {
    'accessToken': token,
    'email': email,
  };

  let result = await fetchGetData(`v1/user/detail?`, params);

  if (result.user) {

    return result;
  } else {
    return false;
  }
}

export function getProfile() {
  return function(dispatch, getState) {
    dispatch({type: PROFILE_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchProfileJson(accessToken, email).then(json => dispatch(receiveProfile(json)));
  };
}