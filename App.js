import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {setCustomText} from 'react-native-global-props';

import {AppLoading, Asset, Font, Icon, SplashScreen, registerRootComponent} from 'expo';
import Colors from './constants/Colors';
import AppNavigator from './navigation/AppNavigator';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './store';

import AlertProvider from './components/alert/alert.component';
import PlayerComponent from './components/Player';

import NavigationService from './services/NavigationService';

import {fetchReleases, validateAccessToken, fetchArtistOfTheWeek, getProfile} from './actions';

import {API_ENDPOINT, DEV} from 'react-native-dotenv';

import playerService from './playerService';
import TrackPlayer from 'react-native-track-player';

console.log('server endpoint: ' + API_ENDPOINT);

if (!!+DEV) {
  store.subscribe(() => console.log('store', store.getState()));
}

// Setting default styles for all Text components.
const customTextProps = {
  style: {
    fontFamily: 'robotoRegular',
    color: Colors.fontColor,
  },
};

// persistor.purge();

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    currentScreen: 'Home',
  };

  constructor(props) {
    super(props);
    SplashScreen.preventAutoHide();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  render() {
    return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {!this.state.isLoadingComplete && !this.props.skipLoadingScreen ?
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
                :
                <AlertProvider>
                  <View style={styles.songInfoContainer}>
                    <StatusBar barStyle="light-content"/>
                    <AppNavigator
                        style={{backgroundColor: Colors.backgroundColor}}
                        ref={navigatorRef => {
                          NavigationService.setTopLevelNavigator(navigatorRef);
                        }}
                        onNavigationStateChange={(prevState, currentState) => {
                          const currentScreen = getActiveRouteName(currentState);
                          const prevScreen = getActiveRouteName(prevState);

                          //reload the profile for these specific screens
                          if (prevScreen !== currentScreen) {
                            if (currentScreen === 'Profile' || currentScreen === 'Wallet' || currentScreen === 'Invite') {
                              if (store.getState().auth.loggedIn) {
                                store.dispatch(getProfile());
                              }
                            }
                            // the line below uses the Google Analytics tracker
                            // change the tracker here to use other Mobile analytics SDK.
                            this.setState({currentScreen});
                          }
                        }}/>
                    <PlayerComponent currentScreen={this.state.currentScreen}/>
                  </View>
                </AlertProvider>
            }
          </PersistGate>
        </Provider>
    );
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/icons/clap-grey.png'),
        require('./assets/icons/clap-white.png'),
        require('./assets/icons/library-grey.png'),
        require('./assets/icons/library-white.png'),
        require('./assets/images/logo.png'),
        require('./assets/images/invite.png'),
        require('./assets/images/guitar.png'),
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'robotoRegular': require('./assets/fonts/Roboto-Regular.ttf'),
        'robotoMedium': require('./assets/fonts/Roboto-Medium.ttf'),
        'robotoBold': require('./assets/fonts/Roboto-Bold.ttf'),
      }),
      store.dispatch(validateAccessToken()).then(() => {
        return Promise.all([
          store.dispatch(fetchArtistOfTheWeek()),
          store.dispatch(fetchReleases())]);
      }),
    ]);
  };

  setComponentDefaults() {
    setCustomText(customTextProps);
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setComponentDefaults();
    this.setState({isLoadingComplete: true});
    TrackPlayer.registerPlaybackService(() => playerService);
    SplashScreen.hide();
  };
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
