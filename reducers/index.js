import {combineReducers} from 'redux';

import accessToken from './accessToken';
import currentTrack from './currentTrack';
import releases from './releases';
import alert from './alert';
import lastAction from './lastAction';
import searchResults from './searchResults';
import searchResultsByGenre from './searchResultsByGenre';
import searchResultsByArtist from './searchResultsByArtist';
import loading from './loading';
import queue from './queue';
import lastPlayed from './lastPlayed';
import settings from './settings';

const rootReducer = combineReducers({releases, accessToken, alert, lastAction, currentTrack, searchResults, searchResultsByGenre, searchResultsByArtist, loading, queue, lastPlayed, settings});

export default rootReducer;