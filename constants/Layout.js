import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width <= 375,
  playerHeight: 49,
  defaultTrackImage: 'https://i.redd.it/y2hj9ovrrne11.jpg',
  playerIconSize: 22,
};
