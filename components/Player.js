import React from 'react';
import {View, Text, Image, Platform, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {PLAY_TRACK} from '../constants/Actions';
import Colors from '../constants/Colors';
import {tipTrack} from '../actions';
import {Icon} from 'expo';
import connectAlert from '../components/alert/connectAlert.component';
import NavigationService from '../services/NavigationService';

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

class PlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {currentTrack: null, isPlaying: false, isLoaded: true};
  }

  async componentDidUpdate(prev) {
    if (prev.lastAction != this.props.lastAction) {
      switch (this.props.lastAction.type) {
        case PLAY_TRACK:
          await this.loadAndPlayTrack(this.props.currentTrack);
          break;
        default:
          break;
      }
    }

  }

  render() {
    return (
        <View>
          {this.props.currentTrack ? <View style={{flex: 0.2}}>
            {this.state.isLoaded ? <View style={styles.playerContainer}>
                  <View style={styles.albumArtPlayerContainer}>
                    <Image style={{width: 70, height: 70}} source={{uri: this.props.currentTrack.trackImg}}/>
                  </View>

                  <TouchableOpacity style={styles.songInfo} onPress={() => NavigationService.navigate('ReleaseDetail', {trackId: this.props.currentTrack.trackId, origin: this.props.currentTrack.origin})}>
                    <View>
                      <Text style={{color: Colors.fontColor}}>{this.props.currentTrack.title}</Text>
                      <Text style={{color: Colors.fontColor, fontSize: 10}}>{this.props.currentTrack.author}</Text>
                    </View>
                  </TouchableOpacity>

                  <View>
                    <TouchableOpacity>
                      <Icon.FontAwesome onPress={() => this.props.tipTrack(this.props.currentTrack.trackId)}
                                        name={Platform.OS === 'ios' ? `signing` : 'signing'}
                                        size={26}
                                        color={Colors.tintColor}
                                        style={{padding: 10, paddingTop: 2, flex: 0.1}}
                      />
                    </TouchableOpacity>
                  </View>

                  {this.state.isPlaying ? <TouchableOpacity>
                        <Icon.Ionicons onPress={() => this.pauseTrack()}
                                       name={Platform.OS === 'ios' ? `ios-pause` : 'md-pause'}
                                       size={26}
                                       color={Colors.tintColor}
                                       style={styles.playerButton}
                        />
                      </TouchableOpacity> :
                      <TouchableOpacity onPress={() => this.resumeTrack()}>
                        <Icon.Ionicons
                            name={Platform.OS === 'ios' ? `ios-play` : 'md-play'}
                            size={26}
                            color={Colors.tintColor}
                            style={styles.playerButton}
                        />
                      </TouchableOpacity>}
                </View> :
                <View style={styles.playerContainer}>
                  <View style={styles.albumArtPlayerContainer}>
                    <Image style={{width: 70, height: 70}} source={{uri: this.props.currentTrack.trackImg}}/>
                  </View>

                  <View style={styles.songInfo}>
                    <Text style={{color: Colors.fontColor}}>Loading</Text>
                  </View>

                  <View>
                    <TouchableOpacity>
                      <Icon.FontAwesome onPress={() => this.props.tipTrack(this.props.currentTrack.trackId)}
                                        name={Platform.OS === 'ios' ? `signing` : 'signing'}
                                        size={26}
                                        color={Colors.tintColor}
                                        style={{padding: 10, paddingTop: 2, flex: 0.1}}
                      />
                    </TouchableOpacity>
                  </View>

                  <ActivityIndicator style={{padding: 10, paddingTop: 2, margin: 10, marginRight: 15, flex: 0.1}} size="small" color={Colors.tintColor}/>
                </View>
            }
          </View> : null}
        </View>);
  }

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

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 49,
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

function mapStateToProps(state) {
  return state;
}

export default connectAlert(connect(mapStateToProps, {tipTrack})(PlayerComponent));