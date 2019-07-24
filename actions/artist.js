import {fetchGetData, fetchPostFormDataJson} from '../tools/util';
import {FOLLOW_ARTIST, RECEIVE_FOLLOWING_ARTISTS_FAILURE, RECEIVE_FOLLOWING_ARTISTS_REQUEST, RECEIVE_FOLLOWING_ARTISTS_SUCCESS} from '../constants/Actions';
import NavigationService from '../services/NavigationService';
import {addAlert} from './alert';

export async function fetchArtistDetailsJson(token, email, profileAddress) {
  var params = {
    'accessToken': token,
    'email': email,
  };

  let result = await fetchGetData(`v1/artist/profile/${profileAddress}?`, params);

  if (result) {
    return result.artist;
  } else {
    return null;
  }
}

function followArtistAction(artist, json, follow) {
  return function(dispatch, getState) {
    let success = false;
    if (json.success) {
      success = true;
    } else {
      return dispatch(addAlert('error', 'Something went wrong', 'Please try again at a later time.'));
    }

    return dispatch({
      type: FOLLOW_ARTIST,
      artist,
      follow,
      success,
    });
  };
}

async function followArtistJson(artist, token, email) {
  let params = {
    follower: artist.artistAddress,
  };

  let follow = await fetchPostFormDataJson(`v1/user/follow?email=${email}&accessToken=${token}`, params);
  return follow;
}

async function unfollowArtistJson(artist, token, email) {
  let params = {
    follower: artist.artistAddress,
  };

  let unfollow = await fetchPostFormDataJson(`v1/user/unfollow?email=${email}&accessToken=${token}`, params);
  return unfollow;
}

export function followArtist(artist, follow) {
  return function(dispatch, getState) {
    let {loggedIn} = getState().auth;
    if (loggedIn) {
      let {accessToken, email} = getState().auth;
      if (follow) {
        return followArtistJson(artist, accessToken, email).then(json => dispatch(followArtistAction(artist, json, follow))).then(() => dispatch(getFollowingArtists()));
      } else {
        return unfollowArtistJson(artist, accessToken, email).then(json => dispatch(followArtistAction(artist, json, follow))).then(() => dispatch(getFollowingArtists()));
      }

    } else {
      NavigationService.navigate('Profile');
    }
  };
}

function receiveFollowingArtists(json, skip) {
  let artists;

  if (json.success && json.data) {
    artists = json.data;
  }

  return {
    type: artists ? RECEIVE_FOLLOWING_ARTISTS_SUCCESS : RECEIVE_FOLLOWING_ARTISTS_FAILURE,
    artists,
    skip,
  };
}

async function fetchFollowingArtistsJson(token, email) {
  var params = {
    'email': email,
    'accessToken': token,
    'limit': 20,
    'skip': 0,
  };

  let results = await fetchGetData(`v1/user/following?`, params);

  for (let i = 0; i < results.data.length; i++) {

    if (!results.data[i].artistAddress) {
      results.data[i].artistAddress = results.data[i].profileAddress;
    }

    if (!results.data[i].imageUrl) {
      results.data[i].imageUrl = results.data[i].avatar;
    }

    if (!results.data[i].artistName) {
      results.data[i].artistName = results.data[i].username;
    }

    if (!results.data[i].followers) {
      results.data[i].followers = 0;
    }

    if (!results.data[i].tipCount) {
      results.data[i].tipCount = 0;
    }

    results.data[i].followed = true;
  }

  return results;

}

export function getFollowingArtists(skip = 0) {
  return function(dispatch, getState) {
    dispatch({type: RECEIVE_FOLLOWING_ARTISTS_REQUEST});
    let {accessToken, email} = getState().auth;
    return fetchFollowingArtistsJson(accessToken, email, skip).then(json => dispatch(receiveFollowingArtists(json, skip)));
  };
}
