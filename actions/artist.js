import {fetchGetData} from '../tools/util';
import {API_VERSION} from 'react-native-dotenv';

export async function fetchArtistDetailsJson(token, email, profileAddress) {
  var params = {
    'accessToken': token,
    'email': email,
  };

  let result = await fetchGetData(`${API_VERSION}/artist/profile/${profileAddress}?`, params);

  if (result) {
    return result.artist;
  } else {
    return null;
  }
}