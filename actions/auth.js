import {fetchPostData, generateRandomString} from '../tools/util';
import {API_VERSION} from 'react-native-dotenv';
import {RECEIVE_ACCESS_TOKEN, RECEIVE_LOGIN_INFO} from '../constants/Actions';
import uuidv1 from 'uuid/v1';

function receiveAccessToken(json) {
  const {accessToken} = json;

  return {
    type: RECEIVE_ACCESS_TOKEN,
    accessToken: accessToken,
  };
}

function receiveLoginInfo(data) {

  return {
    type: RECEIVE_LOGIN_INFO,
    data,
  };
}

async function fetchAccessTokenJson(auth) {
  var params = {
    'email': auth.email,
    'password': auth.password,
    'username': auth.username,
    'clientSecret': auth.clientSecret,

  };

  return fetchPostData(`${API_VERSION}/auth/accesstoken`, params);
}

async function fetchQuickLoginJson(email, username, password) {
  var params = {
    'email': email,
    'password': password,
    'username': username,

  };

  return fetchPostData(`${API_VERSION}/auth/quicklogin`, params);
}

export function fetchAccessToken() {
  return function(dispatch, getState) {
    let auth = getState().auth;
    let username, email, password;
    if (auth) {
      username = auth.username;
      email = auth.email;
      password = auth.password;
    } else {
      // quickLogin
      username = 'app-' + uuidv1();
      email = username + '@musicoin.org';
      password = generateRandomString(10);

    }
    return fetchQuickLoginJson(email, username, password).then(json => dispatch(receiveLoginInfo({...json, email, username, password})));
  };
}
