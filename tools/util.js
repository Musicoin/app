import {AsyncStorage, Share} from 'react-native';
import {API_ENDPOINT} from 'react-native-dotenv';

const ACCESS_TOKEN = 'ACCESS_TOKEN';

let token;

export const getToken = async () => {
  if (token) {
    return Promise.resolve(token);
  }

  token = await AsyncStorage.getItem(ACCESS_TOKEN);
  return token;
};

export const setToken = (newToken) => {
  token = newToken;
  return AsyncStorage.setItem(ACCESS_TOKEN, newToken);
};

export async function fetchGetData(action, params) {
  try {
    let newParams = params;
    let getParams = [];
    for (let property in newParams) {
      let encodedKey = encodeURIComponent(property);
      let encodedValue = encodeURIComponent(newParams[property]);
      getParams.push(encodedKey + '=' + encodedValue);
    }
    getParams = getParams.join('&');

    return fetch(API_ENDPOINT + action + getParams, {
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => {
      try {
        if (response.ok) {
          let result = response.json();
          return result;
        } else {
          console.log(response);
          return false;
        }
      } catch (e) {
        console.log(response);
        return false;
      }
    }).catch(e => {
      console.log(e);
      return false;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function fetchPostData(action, params) {
  try {
    let newParams = params;

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
      try {
        if (response.ok) {
          let result = response.json();
          return result;
        } else {
          console.log(response);
          return false;
        }
      } catch (e) {
        console.log(response);
        return false;
      }
    }).catch(e => {
      console.log(e);
      return false;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function fetchPostFormData(action, params) {
  try {
    let newParams = {
      ...params,
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
      try {
        if (response.ok) {
          let result = response.json();
          return result;
        } else {
          console.log(response);
          return false;
        }
      } catch (e) {
        console.log(response);
        return false;
      }
    }).catch(e => {
      console.log(e);
      return false;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function fetchPostFormDataJson(action, params) {
  try {
    return fetch(API_ENDPOINT + action, {
      method: 'POST',
      headers: {
        'cache-control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }).then(response => {
      try {
        if (response.ok) {
          let result = response.json();
          return result;
        } else {
          console.log(response);
          return false;
        }
      } catch (e) {
        console.log(response);
        return false;
      }
    }).catch(e => {
      console.log(e);
      return false;
    });
  } catch (e) {
    console.log(e);
    return false;
  }
}

function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function intToRGB(i) {
  var c = (i & 0x00FFFFFF).toString(16).toUpperCase();

  return '00000'.substring(0, 6 - c.length) + c;
}

export function getColorCodeForString(string) {
  return '#' + intToRGB(hashCode(string));
}

export function secondsToMinutesAndSeconds(time) {
  var minutes = Math.floor(time / 60);
  var seconds = time - (minutes * 60);
  return minutes.toFixed(0) + ':' + (seconds < 10 ? '0' : '') + seconds.toFixed(0);
}

export function returnIndexFromArray(array, track, reversed = false) {
  let indexArray = [];
  let i = 0;
  for (i; i < array.length; i++) {
    if (array[i].trackAddress === track.trackAddress) {
      indexArray.push(i);
    }
  }

  if (reversed) {
    return indexArray[indexArray.length - 1];
  } else {
    return indexArray[0];
  }
}

export async function shareTrack(track) {
  try {
    let link= 'https://musicoin.org/nav/track/' + track.trackAddress;
    const result = await Share.share({
      title: `${track.artistName} - ${track.title}`,
      dialogTitle: `${track.artistName} - ${track.title}`,
      message: `Listen to ${track.title} by ${track.artistName} on Musicoin: ${link}`,
      url: link,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log(result.activityType);
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
    console.log(error.message);
  }
}

export async function shareArtist(artist) {
  try {
    const result = await Share.share({
      title: `${artist.artistName}`,
      dialogTitle: `${artist.artistName}`,
      message: `Listen to ${artist.artistName} on Musicoin: https://musicoin.org/nav/artist/${artist.profileAddress}`,
      url: `https://musicoin.org/nav/artist/${artist.profileAddress}`,
    });

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
        console.log(result.activityType);
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
    console.log(error.message);
  }
}

export function generateRandomString(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}