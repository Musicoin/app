import {fetchPostData, generateRandomString, fetchGetData} from '../tools/util';
import {RECEIVE_ACCESS_TOKEN, RECEIVE_ANONYMOUS_LOGIN_INFO, LOG_OUT} from '../constants/Actions';
import {getProfile} from './profile';
import {addAlert} from './alert';
import uuidv1 from 'uuid/v1';
import NavigationService from '../services/NavigationService';

function receiveAnonymousLoginInfo(data) {

  return {
    type: RECEIVE_ANONYMOUS_LOGIN_INFO,
    data,
  };
}

function receiveAccessToken(json, origin) {
  console.log(json);
  return {
    type: RECEIVE_ACCESS_TOKEN,
    origin,
    data: json,
  };
}

function doLogOut() {
  return {
    type: LOG_OUT,
  };
}

async function fetchQuickLoginJson(email, password) {
  var params = {
    'email': email,
    'password': password,

  };

  return fetchPostData(`v1/auth/quicklogin`, params);
}

async function fetchLoginJson(email, password) {
  var params = {
    'email': email,
    'password': password,

  };

  return fetchPostData(`v1/auth/login`, params);
}

async function fetchSignupJson(email, username, password) {
  var params = {
    'email': email,
    'username': username,
    'password': password,

  };

  return fetchPostData(`v1/auth/signup`, params);
}

async function fetchSocialLoginJson(channel, accessToken, oauthToken = "",  oauthVerifier = "") {
  var params = {
    channel,
    accessToken,
  };

  if(channel === 'twitter'){
    params = {
      ...params,
      oauthToken,
      oauthVerifier
    }
  }

  return fetchPostData(`v1/auth/sociallogin`, params);
}

async function fetchAccessTokenTimeout(email, token) {
  var params = {
    email,
    accessToken: token,
  };

  return fetchPostData(`v1/auth/accesstoken/timeout`, params);
}

export async function fetchTwitterOauthToken() {
  var params = {
  };

  return fetchGetData(`v1/auth/twitter/oauthtoken`, params);
}

export function validateAccessToken() {
  return async function(dispatch, getState) {

    let {email, accessToken, loggedIn} = getState().auth;
    if (email && accessToken) {
      let result = await fetchAccessTokenTimeout(email, accessToken);

      //check if there's a value in expired, doesn't mean it expired. When it's invalid we don't get this property back but just false instead
      if (!result.error && loggedIn) {
        console.log(result);
        return dispatch(getProfile());
      } else {
        return dispatch(anonymousLogin());
      }

    } else {
      return dispatch(anonymousLogin());
    }
  };
}

export function login(email, password) {
  return function(dispatch, getState) {

    return fetchLoginJson(email, password).then(json => {
      console.log(json);
      if (!json.error) {
        dispatch(receiveAccessToken({...json, email}, 'email'));
        dispatch(getProfile());
        NavigationService.navigate('Profile');
      } else {
        dispatch(addAlert('error', '', json.error));
      }
    });
  };
}

export function signup(email, username, password) {
  return function(dispatch, getState) {

    return fetchSignupJson(email, username, password).then(json => {
      console.log(json);
      if (!json.error) {
        dispatch(receiveAccessToken({...json, email}, 'email'));
        dispatch(getProfile());
        NavigationService.navigate('Profile');
      } else {
        dispatch(addAlert('error', '', json.error));
      }
    });
  };
}

function anonymousLogin() {
  return function(dispatch, getState) {

    let credentials = generateCredentials();
    ({username, email, password} = credentials);
    return fetchQuickLoginJson(email, password).then(json => dispatch(receiveAnonymousLoginInfo({...json, email, username, password})));
  };
}

export function logout() {
  return function(dispatch, getState) {
    return dispatch(anonymousLogin()).then(dispatch(doLogOut()));
  };
}

function generateCredentials() {
  let username = 'app-' + uuidv1();
  let email = username + '@musicoin.org';
  let password = generateRandomString(10);

  return {username, email, password};
}

export function socialLogin(channel, accessToken, oauthToken = "", oauthVerifier= "") {
  return function(dispatch, getState) {
    return fetchSocialLoginJson(channel, accessToken, oauthToken, oauthVerifier).then(json => dispatch(receiveAccessToken(json, channel))).then(() => dispatch(getProfile())).then(() => NavigationService.navigate('Profile'));
  };
}
