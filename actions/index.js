import {API_EMAIL, API_PASSWORD, API_USERNAME, API_CLIENT_SECRET, API_ENDPOINT} from 'react-native-dotenv';

export const RECEIVE_ACCESS_TOKEN = 'RECEIVE_ACCESS_TOKEN';
export const RECEIVE_RELEASES = 'RECEIVE_RELEASES';
export const TIP_TRACK = 'TIP_TRACK';
export const ADD_ALERT = 'ADD_ALERT';
export const DELETE_ALERT = 'DELETE_ALERT';

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
  const releases = json.data;

  return {
    type: RECEIVE_RELEASES,
    releases,
  };
}

async function fetchReleasesJson(token) {

  var params = {
    'accessToken': token,
    'limit': '10',
  };

  let releases = await fetchGetData('release/recent?', params);

  if (releases.data != []) {

    for (let i = 0; i < releases.data.length; i++) {
      let trackPartArray = releases.data[i].trackURL.split('/');
      let trackId = trackPartArray[trackPartArray.length - 1];
      let releaseDetails = await fetchReleaseDetailsJson(token, trackId);
      releases.data[i] = {...releaseDetails.data, ...releases.data[i], trackId};
      let trackImgArray = releases.data[i].trackImg.split('/');
      let trackImg = await fetchTrackImageJson(trackImgArray[trackImgArray.length - 1]);
      releases.data[i].trackImg = trackImg;
    }
    return releases;
  } else {
    return releases;
  }
}

async function fetchReleaseDetailsJson(token, trackId) {
  var params = {
    'accessToken': token,
  };

  let releaseDetails = await fetchGetData(`release/details/${trackId}?`, params);
  return releaseDetails;
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

async function fetchTrackImageJson(imageId) {
  try {
    return fetch(`https://musicoin.org/i2i/${imageId}`, {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
      },
    }).then(response => {
      return response.json();
    }).catch(e => {
      console.log(e);
      return 'https://i.redd.it/y2hj9ovrrne11.jpg';
    });
  } catch (e) {
    console.log(e);
  }
}

function addTip(trackId, json) {
  return function(dispatch, getState) {
    if (json.res == 200) {
      dispatch(addAlert('success', 'thank you!', 'Tip will be added when the next block is mined'));
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please try again later'));
    }
    dispatch({
      type: TIP_TRACK,
      trackId: trackId,
    });
  };
}

async function tipTrackJson(trackId, token) {
  let params = {
    'address': trackId,
    'accessToken': token,
  };

  let tipTrack = await fetchGetData('license/tip?', params);
  return tipTrack;

}

export function tipTrack(trackId) {
  return function(dispatch, getState) {
    let accessToken = getState().accessToken;
    return tipTrackJson(trackId, accessToken.token).then(json => dispatch(addTip(trackId, json)));
  };
}

function showAlert(alert) {
  return {
    type: ADD_ALERT,
    alert: alert,
  };
}

export function addAlert(type, title, message) {
  return function(dispatch) {
    return dispatch(showAlert({type, title, message}));
  };
}

function hideAlert(alert) {
  return {
    type: DELETE_ALERT,
  };
}

export function deleteAlert() {
  return function(dispatch) {
    return dispatch(hideAlert());
  };
}

async function fetchGetData(action, params) {
  try {
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
    }).catch(e => {
      console.log(e);
    });
  } catch (e) {
    console.log(e);
  }

}

async function fetchPostData(action, params) {
  try {
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
    }).then(response => {
      response.json();
    }).catch(e => {
      console.log(e);
    });
  } catch (e) {
    console.log(e);
  }
}