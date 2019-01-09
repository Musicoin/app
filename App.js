import React from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {setCustomText} from 'react-native-global-props';

import {AppLoading, Asset, Font, Icon, SplashScreen} from 'expo';
import Colors from './constants/Colors';
import AppNavigator from './navigation/AppNavigator';

import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './store';

import AlertProvider from './components/alert/alert.component';
import PlayerComponent from './components/Player';

import NavigationService from './services/NavigationService';

import {fetchReleases, fetchAccessToken, fetchArtistOfTheWeek} from './actions';

import {API_ENDPOINT} from 'react-native-dotenv';

console.log("server endpoint: " + API_ENDPOINT);
store.subscribe(() => console.log('store', store.getState()));

// Setting default styles for all Text components.
const customTextProps = {
  style: {
    fontFamily: 'robotoRegular',
    color: Colors.fontColor,
  },
};

// persistor.purge();

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  constructor(props){
    super(props);
    SplashScreen.preventAutoHide();
  }

  componentDidMount() {
    // this.interval = setInterval(() => {
    //   store.dispatch(fetchReleases());
    //   console.log('refresh releases');
    // }, 120000);
  }

  componentWillUnmount() {
    // clearInterval(this.interval);
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
                    <AppNavigator style={{backgroundColor: Colors.backgroundColor}} ref={navigatorRef => {
                      NavigationService.setTopLevelNavigator(navigatorRef);
                    }}/>
                    <PlayerComponent/>
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
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'robotoRegular': require('./assets/fonts/Roboto-Regular.ttf'),
        'robotoMedium': require('./assets/fonts/Roboto-Medium.ttf'),
      }),
      store.dispatch(fetchAccessToken()).then(() => {
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
    SplashScreen.hide();
  };
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});
