import {fetchGetData} from '../tools/util';

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