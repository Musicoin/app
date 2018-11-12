import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'expo';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import connectAlert from '../components/alert/connectAlert.component';
import {tipTrack} from '../actions';

let audioPlayer = null;
const trackPrefix = 'https://a.musicoin.org/tracks/';
const trackSuffix = '/index.m3u8';

Expo.Audio.setAudioModeAsync(
    {
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      interruptionModeIOS: Expo.Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
      interruptionModeAndroid: Expo.Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).then(() => console.log('silent mode activated'));

class HomeScreen extends React.Component {
  static navigationOptions = {
    headerTitle: <View style={{flex: 1, alignItems: 'center', backgroundColor: Colors.backgroundColor, margin: 0, padding: 0}}>
      <Image resizeMode={'center'} style={{width: 150, height: 35.625, margin: 0, padding: 0}} source={require('../assets/images/logo.png')}/>
    </View>,
    headerStyle:
        {
          backgroundColor: Colors.backgroundColor,
          borderBottomWidth: 0,
        },
  };

  constructor(props) {
    super(props);
    this.state = {currentTrack: null, isPlaying: false, isLoaded: true};
  }

  render() {
    return (
        <View style={styles.songInfoContainer}>
          <ScrollView style={{flex: 1}} contentContainerStyle={styles.contentContainer}>
            {this.props.releases.length > 0 ?
                <FlatList
                    data={this.props.releases}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
                : <ActivityIndicator size="small" color={Colors.tintColor}/>}
          </ScrollView>
          {this.state.currentTrack ? <View style={{flex: 0.2}}>
            {this.state.isLoaded ? <View style={styles.playerContainer}>
                  <View style={styles.albumArtPlayerContainer}>
                    <Image style={{width: 70, height: 70}} source={{uri: this.state.currentTrack.trackImg}}/>
                  </View>

                  <TouchableOpacity style={styles.songInfo} onPress={() => this.props.navigation.navigate('ReleaseDetail', {trackId: this.state.currentTrack.trackId})}>
                    <View>
                      <Text style={{color: Colors.fontColor}}>{this.state.currentTrack.title}</Text>
                      <Text style={{color: Colors.fontColor, fontSize: 10}}>{this.state.currentTrack.artistName}</Text>
                    </View>
                  </TouchableOpacity>

                  <View>
                    <TouchableOpacity>
                      <Icon.FontAwesome onPress={() => this.props.tipTrack(this.state.currentTrack.trackId)}
                                        name={Platform.OS === 'ios' ? `signing` : 'signing'}
                                        size={26}
                                        color={Colors.tabIconSelected}
                                        style={{padding: 10, paddingTop: 2, flex: 0.1}}
                      />
                    </TouchableOpacity>
                  </View>

                  {this.state.isPlaying ? <TouchableOpacity>
                        <Icon.Ionicons onPress={() => this.pauseTrack()}
                                       name={Platform.OS === 'ios' ? `ios-pause` : 'md-pause'}
                                       size={26}
                                       color={Colors.tabIconSelected}
                                       style={styles.playerButton}
                        />
                      </TouchableOpacity> :
                      <TouchableOpacity onPress={() => this.resumeTrack()}>
                        <Icon.Ionicons
                            name={Platform.OS === 'ios' ? `ios-play` : 'md-play'}
                            size={26}
                            color={Colors.tabIconSelected}
                            style={styles.playerButton}
                        />
                      </TouchableOpacity>}
                </View> :
                <View style={styles.playerContainer}>
                  <View style={styles.albumArtPlayerContainer}>
                    <Image style={{width: 70, height: 70}} source={{uri: this.state.currentTrack.trackImg}}/>
                  </View>

                  <View style={styles.songInfo}>
                    <Text style={{color: Colors.fontColor}}>Loading</Text>
                  </View>

                  <View>
                    <TouchableOpacity>
                      <Icon.FontAwesome onPress={() => this.props.tipTrack(this.state.currentTrack.trackId)}
                                        name={Platform.OS === 'ios' ? `signing` : 'signing'}
                                        size={26}
                                        color={Colors.tabIconSelected}
                                        style={{padding: 10, paddingTop: 2, flex: 0.1}}
                      />
                    </TouchableOpacity>
                  </View>

                  <ActivityIndicator style={{padding: 10, paddingTop: 2, margin: 10, marginRight: 15, flex: 0.1}} size="small" color={Colors.tintColor}/>
                </View>
            }
          </View> : null}
        </View>
    );
  }

  _keyExtractor = (item, index) => item.trackId;

  _renderItem = ({item}) => (
      <View style={styles.trackContainer}>
        <View style={styles.albumArtContainer}>
          <Image style={{width: 40, height: 40}} source={{uri: item.trackImg}}/>
        </View>

        <TouchableOpacity style={styles.releaseTrackContainer} onPress={() => this.props.navigation.navigate('ReleaseDetail', {trackId: item.trackId})}>
          <Text numberOfLines={1} style={{color: Colors.fontColor}}>{item.title}</Text>
          <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 10}}>{item.artistName}</Text>
        </TouchableOpacity>

        <View style={styles.individualPlayerButton}>
          <TouchableOpacity onPress={() => this.loadAndPlayTrack(item)}>
            <Icon.Ionicons
                name={Platform.OS === 'ios' ? 'ios-play' : 'md-play'}
                size={18}
                color={Colors.tabIconSelected}
                style={styles.playerButton}
            />
          </TouchableOpacity>
        </View>
      </View>
  );

  async loadAndPlayTrack(track) {

    // if (this.state.isLoaded) {
    if (!audioPlayer) {
      audioPlayer = new Expo.Audio.Sound();
      audioPlayer.setOnPlaybackStatusUpdate((playbackstatus) => this.onPlaybackStatusUpdate(playbackstatus));
    }

    this.setState({currentTrack: track, isLoaded: false});

    let playbackState = await audioPlayer.getStatusAsync();
    console.log(playbackState);

    if (playbackState.isLoaded) {
      await audioPlayer.stopAsync();
      await audioPlayer.unloadAsync();
    }

    try {
      await audioPlayer.loadAsync({uri: trackPrefix + track.trackId + trackSuffix}, {}, false);
      await audioPlayer.playAsync();
    } catch (e) {
      console.log('audio failed to play');
      console.log(e);
      this.showAlert('File not playing', 'The requested track failed to play, please try again later.');
      await audioPlayer.stopAsync();
      await audioPlayer.unloadAsync();
    }
    // }
  };

  onPlaybackStatusUpdate(playbackstatus) {
    // console.log(playbackstatus);
    if (this.state.isPlaying != playbackstatus.isPlaying) {
      this.setState({isPlaying: playbackstatus.isPlaying});
    }

    if (this.state.isLoaded != playbackstatus.isLoaded) {
      this.setState({isLoaded: playbackstatus.isLoaded});
    }
  }

  async pauseTrack() {
    // this.setState({isPlaying: false});
    await audioPlayer.pauseAsync();
  }

  async resumeTrack() {
    // this.setState({isPlaying: true});
    await audioPlayer.playAsync();
  }

  showAlert(title, text) {
    this.props.alertWithType('error', title, text);
  }
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
  trackContainer: {
    flexDirection: 'row',
  },
  releaseTrackContainer: {
    paddingTop: 15,
    padding: 10,
    flex: 0.9,
  },
  playButtonContainer: {
    padding: 0,
    margin: 0,
    flex: 0.1,
  },
  playerContainer: {
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
  playerButton: {
    padding: 10,
    marginLeft: 10,
    flex: 0.1,
  },
  individualPlayerButton: {
    marginRight: 10,
    paddingTop: 5,
    flex: 0.2,
  },
  albumArtContainer: {
    padding: 10,
    flex: 0.1,
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

export default connectAlert(connect(mapStateToProps, {tipTrack})(HomeScreen));
