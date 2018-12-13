import {combineReducers} from 'redux';

import accessToken from './accessToken';
import currentTrack from './currentTrack';
import releases from './releases';
import alert from './alert';
import lastAction from './lastAction';
import searchResults from './searchResults';
import searchResultsByGenre from './searchResultsByGenre';
import loading from './loading';
import queue from './queue';
import lastPlayed from './lastPlayed';
import settings from './settings';

const rootReducer = combineReducers({releases, accessToken, alert, lastAction, currentTrack, searchResults, searchResultsByGenre, loading, queue, lastPlayed, settings});

export default rootReducer;