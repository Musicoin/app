import {fetchGetData, fetchPostFormDataJson} from '../tools/util';
import {FOLLOW_ARTIST} from '../constants/Actions';
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
    console.log(json);
    if (json.success) {
      dispatch({
        type: FOLLOW_ARTIST,
        artist,
        follow,
      });
    } else {
      dispatch(addAlert('error', 'Something went wrong', 'Please try again at a later time.'));
    }
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
        return followArtistJson(artist, accessToken, email).then(json => dispatch(followArtistAction(artist, json, follow)));
      } else {
        return unfollowArtistJson(artist, accessToken, email).then(json => dispatch(followArtistAction(artist, json, follow)));
      }

    } else {
      NavigationService.navigate('Profile');
    }
  };
}