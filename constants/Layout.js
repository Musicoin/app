import { Dimensions } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width <= 600,
  playerHeight: 49,
  defaultTrackImage: 'https://i.redd.it/y2hj9ovrrne11.jpg',
  playerIconSize: 22,
};
