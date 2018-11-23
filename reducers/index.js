import {combineReducers} from 'redux';

import accessToken from './accessToken';
import currentTrack from './currentTrack';
import releases from './releases';
import alert from './alert';
import lastAction from './lastAction';
import searchResults from './searchResults';

const rootReducer = combineReducers({releases, accessToken, alert, lastAction, currentTrack, searchResults});

export default rootReducer;