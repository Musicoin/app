import {ARTIST_OF_THE_WEEK_SUCCESS} from '../constants/Actions';

export default function artistOfTheWeek(state = null, action) {
  switch (action.type) {
    case ARTIST_OF_THE_WEEK_SUCCESS:
      if (action.data) {
        let track = {
          title: action.data.trackName,
          trackImg: action.data.trackImg,
          trackAddress: action.data.trackAddress,
        };

        let artist = {
          artistName: action.data.artistName,
          imageUrl: action.data.artistImg,
          profileAddress: action.data.artistAddress,
        };

        return {track, artist};
      } else {
        return state;
      }
    default:
      return state;
  }
}