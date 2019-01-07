import {fetchGetData} from '../tools/util';
import {API_VERSION} from 'react-native-dotenv';

export async function fetchArtistDetailsJson(token, email, profileAddress) {
  var params = {
    'accessToken': token,
    'email': email,
  };

  let result = await fetchGetData(`artist/profile/${API_VERSION}/${profileAddress}?`, params);

  console.log(result);
  if (result) {
    return result;
  } else {
    return null;
  }
}