import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform, FlatList, BackHandler, TouchableOpacity, Dimensions, RefreshControl, ActivityIndicator} from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import {connect} from 'react-redux';
import * as Icon from '@expo/vector-icons';
import Artist from '../../components/Artist';
import {getFollowingArtists, togglePlayerMode} from '../../actions';
import connectAlert from '../../components/alert/connectAlert.component';
import {getStatusBarHeight} from 'react-native-iphone-x-helper/index';
import {GENERAL_API_LIMIT} from '../../constants/App';

var {width} = Dimensions.get('window');

let redirectToPlayer = false;

class FollowingScreen extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;

  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid),
    );
  }

  componentDidMount() {
    this.props.getFollowingArtists(0);
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid),
    );
  }

  onBackButtonPressAndroid = () => {
    if (redirectToPlayer) {
      this.props.togglePlayerMode();
      return true;
    } else {
      return false;
    }
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }

  render() {
    const {navigation} = this.props;
    redirectToPlayer = navigation.getParam('redirectToPlayer', false);
    const following = this.props.following.slice().reverse();
    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingTop: getStatusBarHeight(true)}}>
          <View style={{paddingHorizontal: 16, paddingVertical: 16, width: width, backgroundColor: Colors.tabBar}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{justifyContent: 'center'}}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? `md-arrow-back` : 'md-arrow-back'}
                    size={20}
                    color={Colors.fontColor}
                />
              </TouchableOpacity>
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
                <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 18}}>Following</Text>
              </View>
            </View>
          </View>
          <FlatList
              data={this.props.following}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                    refreshing={(this.props.loading.RECEIVE_FOLLOWING_ARTISTS && this.props.following.length == 0)}
                    onRefresh={() => {
                      this.props.getFollowingArtists(0);
                    }}
                    tintColor={Colors.tintColor}
                />
              }
              ListEmptyComponent={!this.props.loading.RECEIVE_FOLLOWING_ARTISTS ?
                  <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon.Ionicons
                        name={'md-heart'}
                        size={50}
                        color={Colors.tabIconDefault}
                        style={{opacity: 0.5}}
                    />
                    <Text style={{color: Colors.tabIconDefault, fontFamily: 'robotoMedium', fontSize: 16, marginTop: 24}}>Hmm, you haven't added any favorites yet!</Text>
                    <Text style={{color: Colors.tabIconDefault, fontSize: 14, marginTop: 5}}>Favorite some songs and they will be listed here</Text>
                  </View> : null
              }
              ListFooterComponent={
                this.props.loading.RECEIVE_FOLLOWING_ARTISTS && this.props.following.length >= GENERAL_API_LIMIT ?
                    <ActivityIndicator size="small" color={Colors.tintColor} style={{marginTop: 10}}/> :
                    null}
              onEndReached={() => {
                !this.props.loading.RECEIVE_FOLLOWING_ARTISTS && this.props.following.length >= GENERAL_API_LIMIT ?
                    this.props.getFollowingArtists(this.props.following.length) :
                    null;
              }}
              initialNumToRender={5}
              onEndReachedThreshold={1.5}
          />
        </View>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Artist artist={item}/>
  );
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  songInfoContainer: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentContainer: {
    paddingTop: 0,
  },
  playButtonContainer: {
    padding: 0,
    margin: 0,
    flex: 0.1,
  },
  smallPlayerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 5,
  },
  albumArtPlayerContainer: {
    padding: 10,
    flex: 0.3,
  },
  songInfo: {
    padding: 10,
    marginRight: 10,
    flex: 0.6,
  },
});

export default connectAlert(connect(mapStateToProps, {togglePlayerMode, getFollowingArtists})(FollowingScreen));
