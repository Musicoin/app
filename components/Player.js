import React from 'react';
import {View, Text, Image, Platform, TouchableOpacity, StyleSheet, ActivityIndicator, StatusBar, TouchableWithoutFeedback} from 'react-native';
import {Slider} from 'react-native-elements';
import {connect} from 'react-redux';
import {PLAY_TRACK} from '../constants/Actions';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import TextTicker from 'react-native-text-ticker';
import Modal from 'react-native-modal';
import {tipTrack, removeFromQueue, addToQueue, playTrack, toggleRepeat, toggleShuffle, togglePlayerMode} from '../actions';
import {Icon} from 'expo';
import connectAlert from '../components/alert/connectAlert.component';
import NavigationService from '../services/NavigationService';
import {millisToMinutesAndSeconds, returnIndexFromArray, shareTrack} from '../tools/util';
import {getStatusBarHeight, getBottomSpace} from 'react-native-iphone-x-helper';

let audioPlayer = null;

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
      isPaused: false,
      isLoaded: true,
      isBuffering: false,
      shouldPlay: true,
      currentPosition: 0,
      maxValue: 0,
      isModalVisible: false,
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

  _toggleModal() {
    this.setState({isModalVisible: !this.state.isModalVisible});
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
          {this.props.currentTrack && !this.props.settings.bigPlayer ?
              <View>
                <View style={styles.smallPlayerContainer}>
                  <View>
                    <TouchableOpacity>
                      <Icon.Ionicons onPress={() => this.props.togglePlayerMode()}
                                     name={Platform.OS === 'ios' ? `ios-arrow-up` : 'ios-arrow-up'}
                                     size={Layout.playerIconSize}
                                     color={Colors.fontColor}
                                     style={[styles.playerButton, {marginLeft: 5}]}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.songInfo} onPress={() => this.props.togglePlayerMode()}>
                    <View>
                      <TextTicker
                          style={{color: Colors.fontColor, fontSize: 12}}
                          duration={5000}
                          loop
                          repeatSpacer={50}
                          marqueeDelay={1000}
                      >
                        {this.props.currentTrack.title}
                      </TextTicker>
                      <TextTicker
                          style={{color: '#8B99A4', fontSize: 12}}
                          duration={5000}
                          loop
                          repeatSpacer={50}
                          marqueeDelay={1000}
                      >
                        {this.props.currentTrack.artistName}
                      </TextTicker>
                    </View>
                  </TouchableOpacity>

                  <View>
                    {this.props.nextTipAllowed ?
                        <TouchableOpacity onPress={() => this.props.tipTrack(this.props.currentTrack.trackAddress)}>
                          <Image
                              source={require('../assets/icons/clap-white.png')}
                              fadeDuration={0}
                              style={[{width: 20, height: 20}, styles.playerButton]}
                          />
                        </TouchableOpacity>
                        : <TouchableOpacity disabled={true} onPress={() => this.props.tipTrack(this.props.currentTrack.trackAddress)}>
                          <Image
                              source={require('../assets/icons/clap-grey.png')}
                              fadeDuration={0}
                              style={[{width: 20, height: 20}, styles.playerButton]}
                          />
                        </TouchableOpacity>}
                  </View>
                  {!this.state.isLoaded || this.state.isBuffering || (!this.state.shouldPlay && !this.state.isPaused) ?
                      <ActivityIndicator style={{paddingHorizontal: 10, paddingVertical: 2}} size="small" color={Colors.fontColor}/> :
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
                          </TouchableOpacity>}

                </View>
              </View> : null}
          {this.props.currentTrack && this.props.settings.bigPlayer ?
              <View style={styles.bigPlayerContainer}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{flex: 1, flexDirection: 'row', paddingTop: 10, justifyContent: 'flex-start', paddingLeft: 16}}>
                    <TouchableOpacity onPress={() => this.props.togglePlayerMode()}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-arrow-down` : 'ios-arrow-down'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', paddingTop: 10, justifyContent: 'flex-end', paddingRight: 16}}>
                    <TouchableOpacity style={{paddingLeft: 40}} onPress={() => {
                      this.props.togglePlayerMode();
                      NavigationService.navigate('Library', {redirectToPlayer: true});
                    }}>
                      <Icon.MaterialIcons
                          name={'playlist-play'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingLeft: 40}} onPress={() => shareTrack(this.props.currentTrack)}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-share-alt` : 'ios-share-alt'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{paddingLeft: 40, paddingRight: 10}} onPress={() => this._toggleModal()}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `md-more` : 'md-more'}
                          size={26}
                          color={Colors.fontColor}
                      />
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={{flex: 1, alignItems: 'center', marginVertical: 5, paddingTop: Layout.isSmallDevice ? 10 : 100}}>
                  <Image style={{width: Layout.window.width / 2, height: Layout.window.width / 2}} source={{uri: this.props.currentTrack.trackImg}}/>
                  <View style={{marginTop: 50, marginHorizontal: 16}}>
                    <View style={styles.centerText}>
                      <TextTicker
                          style={{color: Colors.tintColor, fontSize: 18, alignSelf: 'center'}}
                          duration={5000}
                          loop
                          repeatSpacer={50}
                          marqueeDelay={1000}
                      >
                        {this.props.currentTrack.title}
                      </TextTicker>
                    </View>
                    <View style={styles.centerText}>
                      <TextTicker
                          style={{color: '#8897A2', fontSize: 14, alignSelf: 'center', alignItems: 'center'}}
                          duration={5000}
                          loop
                          repeatSpacer={50}
                          marqueeDelay={1000}
                      >
                        {this.props.currentTrack.artistName}
                      </TextTicker>
                    </View>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: Layout.isSmallDevice ? 0 : 50}}>
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
                          size={Layout.isSmallDevice ? 20 : 40}
                          color={this.props.settings.repeat ? Colors.tintColor : Colors.fontColor}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.previousAllowed} style={{marginHorizontal: 5}} onPress={() => this.playPreviousTrack()}>
                      <Icon.MaterialIcons
                          name="skip-previous"
                          size={Layout.isSmallDevice ? 40 : 80}
                          color={this.state.previousAllowed ? Colors.fontColor : Colors.disabled}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                    {this.state.isPlaying ?
                        <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => this.pauseTrack()}>
                          <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `ios-pause` : 'md-pause'}
                              size={Layout.isSmallDevice ? 60 : 120}
                              color={Colors.fontColor}
                              style={styles.playerButton}
                          />
                        </TouchableOpacity> :
                        <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => this.resumeTrack()}>
                          <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `ios-play` : 'md-play'}
                              size={Layout.isSmallDevice ? 60 : 120}
                              color={Colors.fontColor}
                              style={styles.playerButton}
                          />
                        </TouchableOpacity>}
                    <TouchableOpacity disabled={!this.state.nextAllowed} style={{marginHorizontal: 5}} onPress={() => this.playNextTrack()}>
                      <Icon.MaterialIcons
                          name="skip-next"
                          size={Layout.isSmallDevice ? 40 : 80}
                          color={this.state.nextAllowed ? Colors.fontColor : Colors.disabled}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => {
                      this.props.toggleShuffle();
                    }}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-shuffle` : 'md-shuffle'}
                          size={Layout.isSmallDevice ? 20 : 40}
                          color={this.props.settings.shuffle ? Colors.tintColor : Colors.fontColor}
                          style={styles.playerButton}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16}}>
                    <TouchableOpacity
                        style={{flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginLeft: 15}}
                        onPress={() => {
                          this.props.togglePlayerMode();
                          NavigationService.navigate('ReleaseDetail', {trackAddress: this.props.currentTrack.trackAddress, origin: 'currentTrack'});
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
                    {this.props.nextTipAllowed ?
                        <TouchableOpacity
                            style={{flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 15}}
                            onPress={() => this.props.tipTrack(this.props.currentTrack.trackAddress)}>
                          <Image
                              source={require('../assets/icons/clap-white.png')}
                              fadeDuration={0}
                              style={{width: 16, height: 16, marginRight: 5}}
                          />
                          <Text style={{color: Colors.fontColor, fontSize: 12}}>Tip</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            disabled={true}
                            style={{flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 15}}
                            onPress={() => this.props.tipTrack(this.props.currentTrack.trackAddress)}>
                          <Image
                              source={require('../assets/icons/clap-grey.png')}
                              fadeDuration={0}
                              style={{width: 16, height: 16, marginRight: 5}}
                          />
                          <Text style={{color: Colors.tabIconDefault, fontSize: 12}}>Tip</Text>
                        </TouchableOpacity>}
                  </View>
                </View>
                <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this._toggleModal()}>
                  <View style={{backgroundColor: Colors.backgroundColor}}>
                    <View style={{flexDirection: 'row'}}>
                      <Image style={{width: 64, height: 64, margin: 16}} source={{uri: this.props.currentTrack.trackImg}}/>
                      <View style={{marginVertical: 16}}>
                        <TextTicker
                            style={{color: Colors.tintColor, fontSize: 16, width: 200}}
                            duration={5000}
                            loop
                            bounce
                            repeatSpacer={50}
                            marqueeDelay={1000}
                        >
                          {this.props.currentTrack.title}
                        </TextTicker>
                        <TextTicker
                            style={{color: '#8897A2', fontSize: 12, marginTop: 8, width: 200}}
                            duration={5000}
                            loop
                            bounce
                            repeatSpacer={50}
                            marqueeDelay={1000}
                        >
                          {this.props.currentTrack.artistName}
                        </TextTicker>
                      </View>
                    </View>
                  </View>
                  <View style={{backgroundColor: '#2E343A'}}>
                    <TouchableOpacity style={styles.modalButton} onPress={() => {
                      this._toggleModal();
                      this.props.addToQueue(this.props.currentTrack);
                    }}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
                          size={24}
                          color={'#8897A2'}
                          style={{marginRight: 16}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 14}}>Add to queue</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={() => {
                      this._toggleModal();
                      this.props.togglePlayerMode();
                      NavigationService.navigate('ReleaseDetail', {trackAddress: this.props.currentTrack.trackAddress, origin: this.props.currentTrack.origin});
                    }}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? 'ios-eye' : 'md-eye'}
                          size={24}
                          color={'#8897A2'}
                          style={{marginRight: 16}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 14}}>Track details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} disabled={!this.props.nextTipAllowed} onPress={() => {
                      this._toggleModal();
                      this.props.tipTrack(this.props.currentTrack.trackAddress);
                    }}>
                      <Image
                          source={require('../assets/icons/clap-grey.png')}
                          fadeDuration={0}
                          style={{width: 16, height: 16, marginRight: 16}}
                      />
                      <Text style={{color: this.props.nextTipAllowed ? Colors.fontColor : Colors.tabIconDefault, fontSize: 14}}>Tip track</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={() => {
                      this._toggleModal();
                      this.props.togglePlayerMode();
                      NavigationService.navigate('ArtistScreen', {profileAddress: this.props.currentTrack.artistAddress});
                    }}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? 'ios-star' : 'md-star'}
                          size={24}
                          color={'#8897A2'}
                          style={{marginRight: 16}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 14}}>Go to artist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={() => {
                      shareTrack(this.props.currentTrack).then(console.log('shared'));
                    }}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? 'ios-share-alt' : 'ios-share-alt'}
                          size={24}
                          color={'#8897A2'}
                          style={{marginRight: 16}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 14}}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View> : null}
        </View>);
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

    this.setState({currentTrack: track, currentPosition: 0, isPaused: false});

    let playbackState = await audioPlayer.getStatusAsync();
    console.log(playbackState);

    if (playbackState.isLoaded) {
      await audioPlayer.stopAsync();
      await audioPlayer.unloadAsync();
    }

    try {
      await audioPlayer.loadAsync({uri: track.trackUrl}, {}, false);
      await audioPlayer.playAsync();
    } catch (e) {
      await audioPlayer.unloadAsync();
      console.log('audio failed to play');
      console.log(e);
      this.showAlert('', 'Hmm, we couldn’t play this track. Please try again in a moment.');
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

    if (this.state.isBuffering != playbackstatus.isBuffering) {
      this.setState({isBuffering: playbackstatus.isBuffering});
    }

    if (this.state.shouldPlay != playbackstatus.shouldPlay) {
      this.setState({shouldPlay: playbackstatus.shouldPlay});
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
    this.setState({isPaused: true});
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
        this.setState({isPaused: false});
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
    bottom: 49 + getBottomSpace(),
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
    paddingTop: getStatusBarHeight(true),
    paddingBottom: getBottomSpace(),
  },
  centerText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsButton: {
    justifyContent: 'center',
  },
  modalButton: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

function mapStateToProps(state) {
  return state;
}

export default connectAlert(connect(mapStateToProps, {tipTrack, removeFromQueue, addToQueue, playTrack, toggleRepeat, toggleShuffle, togglePlayerMode})(PlayerComponent));