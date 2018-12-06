import {AsyncStorage} from 'react-native';
import {API_EMAIL, API_ENDPOINT} from 'react-native-dotenv';

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
    let newParams = {
      ...params,
      'email': API_EMAIL,
    };

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

export function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
