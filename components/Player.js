import React from 'react';
import {View, Text, Image, Platform, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, TouchableWithoutFeedback, Share} from 'react-native';
import {Slider} from 'react-native-elements';
import {connect} from 'react-redux';
import {PLAY_TRACK} from '../constants/Actions';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import {tipTrack, removeFromQueue, addToQueue, playTrack, toggleRepeat, toggleShuffle} from '../actions';
import {Icon} from 'expo';
import connectAlert from '../components/alert/connectAlert.component';
import NavigationService from '../services/NavigationService';
import {millisToMinutesAndSeconds, returnIndexFromArray} from '../tools/util';

let audioPlayer = null;
const trackPrefix = 'https://a.musicoin.org/track/';
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
    this.state = {
      currentTrack: null,
      isPlaying: false,
      isLoaded: true,
      showExpandedPlayer: false,
      currentPosition: 0,
      maxValue: 0,
    };
  }

  componentDidMount() {
    this.checkPreviousAndNext();
  }

  async componentDidUpdate(prev) {
    if (prev.lastAction != this.props.lastAction) {
      switch (this.props.lastAction.type) {
        case PLAY_TRACK:
          this.setState({currentPosition: 0});
          this.checkPreviousAndNext();
          await this.loadAndPlayTrack(this.props.currentTrack);
          break;
        default:
          break;
      }
    }

  }

  checkPreviousAndNext() {
    // get index of the track to check if we can play a previous or next track
    let trackList = this.getTrackList();
    let previousAllowed = false;
    let nextAllowed = false;

    let index = returnIndexFromArray(trackList, this.props.currentTrack, false);

    if (this.props.lastPlayed.length > 1 && returnIndexFromArray(this.props.lastPlayed, this.props.currentTrack, true) != 0) {
      previousAllowed = true;
    }

    if (this.props.settings.shuffle) {
      nextAllowed = true;

    } else {
      if (index < trackList.length - 1) {
        nextAllowed = true;
      }
    }

    this.setState({previousAllowed, nextAllowed});

  }

  getTrackList() {
    let trackList = [];
    if (this.props.currentTrack) {
      switch (this.props.currentTrack.origin) {
        case 'new':
          trackList = this.props.releases;
          break;
        case 'queue':
          trackList = this.props.queue;
          break;
        case 'search':
          trackList = this.props.searchResults.releases;
          break;
        case 'genre':
          trackList = this.props.searchResultsByGenre;
          break;
        case 'artist':
          trackList = this.props.searchResultsByArtist;
          break;
        default:
          break;
      }
    }
    return trackList;
  }

  render() {
    return (
        <View>
          {this.props.currentTrack && !this.state.showExpandedPlayer ?
              <View>
                <View style={styles.smallPlayerContainer}>
                  <View>
                    <TouchableOpacity>
                      <Icon.Ionicons onPress={() => this.setState({showExpandedPlayer: !this.state.showExpandedPlayer})}
                                     name={Platform.OS === 'ios' ? `ios-arrow-up` : 'ios-arrow-up'}
                                     size={Layout.playerIconSize}
                                     color={Colors.fontColor}
                                     style={[styles.playerButton, {marginLeft: 5}]}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.songInfo} onPress={() => this.setState({showExpandedPlayer: !this.state.showExpandedPlayer})}>
                    <View>
                      <Text style={{color: Colors.fontColor, fontSize: 12}}>{this.props.currentTrack.title}</Text>
                      <Text style={{color: '#8B99A4', fontSize: 12}}>{this.props.currentTrack.author}</Text>
                    </View>
                  </TouchableOpacity>

                  <View>
                    <TouchableOpacity onPress={() => this.props.tipTrack(this.props.currentTrack.trackId)}>
                      <Image
                          source={require('../assets/icons/clap-white.png')}
                          fadeDuration={0}
                          style={[{width: 20, height: 20}, styles.playerButton]}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.isLoaded ?
                      this.state.isPlaying ?
                          <TouchableOpacity>
                            <Icon.Ionicons onPress={() => this.pauseTrack()}
                                           name={Platform.OS === 'ios' ? `ios-pause` : 'md-pause'}
                                           size={Layout.playerIconSize}
                                           color={Colors.fontColor}
                                           style={styles.playerButton}
                            />
                          </TouchableOpacity> :
                          <TouchableOpacity onPress={() => this.resumeTrack()}>
                            <Icon.Ionicons
                                name={Platform.OS === 'ios' ? `ios-play` : 'md-play'}
                                size={Layout.playerIconSize}
                                color={Colors.fontColor}
                                style={styles.playerButton}
                            />
                          </TouchableOpacity>
                      :
                      <ActivityIndicator style={{paddingHorizontal: 10, paddingVertical: 2}} size="small" color={Colors.fontColor}/>}

                </View>
              </View> : null}
          {this.props.currentTrack && this.state.showExpandedPlayer ?
              <View style={styles.bigPlayerContainer}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'row', paddingTop: 10, justifyContent: 'flex-start', paddingLeft: 16}}>
                    <TouchableOpacity onPress={() => this.setState({showExpandedPlayer: !this.state.showExpandedPlayer})}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-arrow-down` : 'ios-arrow-down'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', paddingTop: 10, justifyContent: 'flex-end', paddingRight: 16}}>
                    <TouchableOpacity style={{paddingLeft: 40}} onPress={() => {
                      this.setState({showExpandedPlayer: false});
                      NavigationService.navigate('LibraryStack');
                    }}>
                      <Icon.MaterialIcons
                          name={'playlist-play'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingLeft: 40}} onPress={() => this.shareTrack()}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-share-alt` : 'ios-share-alt'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingLeft: 40}} onPress={() => this.props.addToQueue(this.props.currentTrack)}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `md-add` : 'md-add'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={{flex: 1, alignItems: 'center', marginVertical: 5, paddingTop: 10}}>
                  <Image style={{width: 248, height: 248}} source={{uri: this.props.currentTrack.trackImg}}/>
                  <View style={{marginTop: 50, marginHorizontal: 16}}>
                    <Text style={{color: Colors.tintColor, fontSize: 18, alignSelf: 'center'}}>{this.props.currentTrack.title}</Text>
                    <Text style={{color: '#8897A2', fontSize: 14, alignSelf: 'center'}}>{this.props.currentTrack.author}</Text>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{width: 50, paddingHorizontal: 5, alignItems: 'center'}}>
                      <Text style={{color: Colors.fontColor, fontSize: 10}}>{millisToMinutesAndSeconds(this.state.currentPosition)}</Text>
                    </View>
                    <View style={{flex: 1}} ref="slider">
                      <TouchableWithoutFeedback onPressIn={this.tapSliderHandler}>
                        <Slider
                            trackStyle={{
                              height: 3,
                              borderRadius: 1,
                            }}
                            thumbStyle={{
                              width: 10,
                              height: 10,
                              borderRadius: 10 / 2,
                              backgroundColor: Colors.tintColor,
                            }}
                            value={this.state.currentPosition}
                            minimumValue={0}
                            maximumValue={this.state.maxValue}
                            onSlidingComplete={(value) => this.setNewPosition(value)}
                            onSlidingStart={(value) => this.setNewPosition(value)}
                            minimumTrackTintColor={Colors.tintColor}
                            maximumTrackTintColor={Colors.fontColor}
                            thumbTintColor={Colors.tintColor}
                        />
                      </TouchableWithoutFeedback>
                    </View>
                    <View style={{width: 50, paddingHorizontal: 5, alignItems: 'center'}}>
                      <Text style={{color: Colors.fontColor, fontSize: 10}}>{millisToMinutesAndSeconds(this.state.maxValue)}</Text>
                    </View>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => this.props.toggleRepeat()}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-repeat` : 'md-repeat'}
                          size={20}
                          color={this.props.settings.repeat ? Colors.tintColor : Colors.fontColor}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.previousAllowed} style={{marginHorizontal: 5}} onPress={() => this.playPreviousTrack()}>
                      <Icon.MaterialIcons
                          name="skip-previous"
                          size={40}
                          color={this.state.previousAllowed ? Colors.fontColor : Colors.disabled}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                    {this.state.isPlaying ?
                        <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => this.pauseTrack()}>
                          <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `ios-pause` : 'md-pause'}
                              size={60}
                              color={Colors.fontColor}
                              style={styles.playerButton}
                          />
                        </TouchableOpacity> :
                        <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => this.resumeTrack()}>
                          <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `ios-play` : 'md-play'}
                              size={60}
                              color={Colors.fontColor}
                              style={styles.playerButton}
                          />
                        </TouchableOpacity>}
                    <TouchableOpacity disabled={!this.state.nextAllowed} style={{marginHorizontal: 5}} onPress={() => this.playNextTrack()}>
                      <Icon.MaterialIcons
                          name="skip-next"
                          size={40}
                          color={this.state.nextAllowed ? Colors.fontColor : Colors.disabled}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => {
                      this.props.toggleShuffle();
                    }}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-shuffle` : 'md-shuffle'}
                          size={20}
                          color={this.props.settings.shuffle ? Colors.tintColor : Colors.fontColor}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end'}}>
                    <TouchableOpacity
                        style={{flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginLeft: 15}}
                        onPress={() => {
                          this.setState({showExpandedPlayer: false});
                          NavigationService.navigate('ReleaseDetail', {trackId: this.props.currentTrack.trackId, origin: this.props.currentTrack.origin});
                        }}>
                      <Icon.Ionicons
                          name={'md-disc'}
                          size={20}
                          color={Colors.fontColor}
                          style={{marginRight: 5}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 12}}>Info</Text>
                    </TouchableOpacity>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>

                    </View>
                    <TouchableOpacity
                        style={{flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 15}}
                        onPress={() => this.props.tipTrack(this.props.currentTrack.trackId)}>
                      <Image
                          source={require('../assets/icons/clap-white.png')}
                          fadeDuration={0}
                          style={{width: 16, height: 16, marginRight: 5}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 12}}>Tip</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View> : null}
        </View>);
  }

  async shareTrack() {
    try {
      const track = this.props.currentTrack;
      track.link = track.link.replace('musicion', 'musicoin');
      const result = await Share.share({
        title: `${track.author} - ${track.title}`,
        dialogTitle: `${track.author} - ${track.title}`,
        message: `Listen to ${track.title} by ${track.author} on Musicoin: ${track.link}`,
        url: `${track.link}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log(result.activityType);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  async setNewPosition(newValue) {
    console.log(`new position: ${newValue}`);
    let result = await audioPlayer.setPositionAsync(newValue);
    console.log(result);
  }

  tapSliderHandler = (evt) => {
    //ToDo: fix tapping on the slider to change the value
    // this.refs.slider.measure((fx, fy, width, height, px, py) => { this.setNewPosition((evt.nativeEvent.locationX - px) / width); });
  };

  async loadAndPlayTrack(track) {

    // if (this.state.isLoaded) {
    console.log(audioPlayer);
    if (!audioPlayer) {
      audioPlayer = new Expo.Audio.Sound();
      audioPlayer.setOnPlaybackStatusUpdate((playbackstatus) => this.onPlaybackStatusUpdate(playbackstatus));
    }

    this.setState({currentTrack: track, isLoaded: false, currentPosition: 0});

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
      await audioPlayer.unloadAsync();
      console.log('audio failed to play');
      console.log(e);
      this.showAlert('File not playing', 'The requested track failed to play, please try again later.');
    }
    // }
  };

  onPlaybackStatusUpdate(playbackstatus) {
    if (this.state.isPlaying != playbackstatus.isPlaying) {
      this.setState({isPlaying: playbackstatus.isPlaying});
    }

    if (this.state.isLoaded != playbackstatus.isLoaded) {
      this.setState({isLoaded: playbackstatus.isLoaded});
    }

    if (playbackstatus.didJustFinish) {
      // replay if in repeat mode or start next track in queue
      if (this.props.settings.repeat) {
        audioPlayer.replayAsync().then(console.log('repeat'));
      } else {
        this.playNextTrack();
      }
    }
    if (playbackstatus.positionMillis && playbackstatus.durationMillis) {
      this.setState({currentPosition: playbackstatus.positionMillis, maxValue: playbackstatus.durationMillis});
    }
  }

  async pauseTrack() {
    // this.setState({isPlaying: false});
    await audioPlayer.pauseAsync();
  }

  playPreviousTrack() {
    let trackList = this.props.lastPlayed;
    let index = returnIndexFromArray(trackList, this.props.currentTrack, true);
    if (trackList[index - 1]) {
      this.props.playTrack(trackList[index - 1], false);
    }
  }

  playNextTrack() {
    let trackList = this.getTrackList();
    let index = returnIndexFromArray(trackList, this.props.currentTrack, false);
    if (this.props.settings.shuffle) {
      let newIndex = this.generateRandom(0, trackList.length - 1, index);
      if (trackList[newIndex]) {
        this.props.playTrack(trackList[newIndex]);
      }
    }
    else {
      if (trackList[index + 1]) {
        this.props.playTrack(trackList[index + 1]);
      }
    }
  }

  generateRandom(min, max, excludedValue) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (num == excludedValue) ? this.generateRandom(min, max) : num;
  }

  async resumeTrack() {
    // play again if track has finished playing
    if (this.state.currentPosition == this.state.maxValue && this.state.currentPosition != 0 && this.state.maxValue > 0) {
      await audioPlayer.replayAsync();
    } else {
      if (audioPlayer) {
        await audioPlayer.playAsync();
      } else {
        this.props.playTrack(this.props.currentTrack, false);
      }
    }
  }

  showAlert(title, text) {
    this.props.alertWithType('error', title, text);
  }
}

const styles = StyleSheet.create({
  smallPlayerContainer: {
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
    justifyContent: 'center',
    backgroundColor: '#34393F',
    paddingVertical: 10,
    paddingRight: 10,
  },
  playerButton: {
    marginHorizontal: 10,
    paddingLeft: 10,
    paddingVertical: 2,
  },
  individualPlayerButton: {
    marginRight: 10,
    paddingTop: 5,
  },
  songInfo: {
    paddingHorizontal: 10,
    marginRight: 10,
    flex: 1,
  },
  bigPlayerContainer: {
    position: 'absolute',
    height: Layout.window.height,
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
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
});

function mapStateToProps(state) {
  return state;
}

export default connectAlert(connect(mapStateToProps, {tipTrack, removeFromQueue, addToQueue, playTrack, toggleRepeat, toggleShuffle})(PlayerComponent));