import {API_EMAIL, API_PASSWORD, API_USERNAME, API_CLIENT_SECRET, API_ENDPOINT, ACCESS_TOKEN} from 'react-native-dotenv';
import Data from '../constants/Data';

export const RECEIVE_ACCESS_TOKEN = 'RECEIVE_ACCESS_TOKEN';
export const RECEIVE_RELEASES = 'RECEIVE_RELEASES';

function receiveAccessToken(json) {
  const {accessToken} = json;

  return {
    type: RECEIVE_ACCESS_TOKEN,
    accessToken: {token: accessToken, receivedAt: Date.now()},
  };
}

async function fetchAccessTokenJson() {

  var params = {
    'password': API_PASSWORD,
    'username': API_USERNAME,
    'clientSecret': API_CLIENT_SECRET,

  };

  return fetchPostData('authtoken', params);

}

export function fetchAccessToken() {
  return function(dispatch) {
    return fetchAccessTokenJson().then(json => dispatch(receiveAccessToken(json)));
  };
}

function receiveReleases(json) {
  const releases = json;

  return {
    type: RECEIVE_RELEASES,
    releases,
  };
}

async function fetchReleasesJson(token) {

  // var params = {
  //   'accessToken': token,
  //   'limit': '10',
  // };
  //
  // let releases = await fetchGetData('release/recent?', params);
  //
  // if (releases.data != []) {
  //
  //   for (let i=0; i < releases.data.length;i++) {
  //     let trackPartArray = releases.data[i].trackURL.split('/');
  //     let trackId = trackPartArray[trackPartArray.length - 1];
  //     let releaseDetails = await fetchReleaseDetailsJson(token, trackId);
  //     releases.data[i] = {...releaseDetails.data, ...releases.data[i], trackId};
  //   }
  //   return releases;
  // } else {
  //   return releases;
  // }
  return Data;
}

async function fetchReleaseDetailsJson(token, trackId) {
  var params = {
    'accessToken': token,
  };

  let releaseDetails = await fetchGetData(`release/details/${trackId}?`, params);
  return releaseDetails;
}

async function fetchGetData(action, params) {
  let newParams = {
    ...params,
    'email': API_EMAIL,
  };

  let formBody = [];
  for (let property in newParams) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(newParams[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  return fetch(API_ENDPOINT + action + formBody, {
    method: 'GET',
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(response => {
    return response.json();
  });
}

async function fetchPostData(action, params) {
  let newParams = {
    ...params,
    'email': API_EMAIL,
  };

  let formBody = [];
  for (let property in newParams) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(newParams[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  return fetch(API_ENDPOINT + action, {
    method: 'POST',
    headers: {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  }).then(response => response.json());
}

export function fetchReleases() {
  return function(dispatch, getState) {
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