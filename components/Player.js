import React from 'react';
import {View, Text, Image, Platform, TouchableOpacity, StyleSheet, ActivityIndicator, BackHandler} from 'react-native';
import {connect} from 'react-redux';
import {PLAY_TRACK} from '../constants/Actions';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import TextTicker from 'react-native-text-ticker';
import Modal from 'react-native-modal';
import {tipTrack, removeFromQueue, addToQueue, playTrack, toggleRepeat, toggleShuffle, togglePlayerMode} from '../actions';
import {Icon} from 'expo';
import connectAlert from '../components/alert/connectAlert.component';
import TrackSlider from '../components/TrackSlider';
import NavigationService from '../services/NavigationService';
import {returnIndexFromArray, shareTrack} from '../tools/util';
import {getStatusBarHeight, getBottomSpace} from 'react-native-iphone-x-helper';
import {FULLSCREEN_VIEWS} from '../constants/App';
import TippingModal from '../components/TippingModal';

import TrackPlayer from 'react-native-track-player';

TrackPlayer.setupPlayer().then(() => {
  // The player is ready to be used
  updateOptions();

});

function updateOptions() {
  let options = {
    stopWithApp: true,
    capabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
      TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
      TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
    ],
    compactCapabilities: [
      TrackPlayer.CAPABILITY_PLAY,
      TrackPlayer.CAPABILITY_PAUSE,
    ],
  };

  TrackPlayer.updateOptions(options).then(() => console.log('capabilities set'));
}

class PlayerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: null,
      isModalVisible: false,
      playerState: TrackPlayer.STATE_NONE,
      isTippingModalVisible: false,
      retries: 0,
    };
  }

  handleBackPress = () => {
    if (this.props.settings.bigPlayer) {
      this.props.togglePlayerMode();
      return true;
    }

    return false;
  };

  componentDidMount() {
    this.checkPreviousAndNext();
    this.onPlayerUpdate = TrackPlayer.addEventListener('playback-state', (data) => this.onPlaybackStatusUpdate(data));
    this.onPlayerError = TrackPlayer.addEventListener('playback-error', (data) => this.onPlaybackError(data));
    this.onPlayerQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', (data) => this.onQueueEnded(data));

    TrackPlayer.addEventListener('remote-play', () => this.resumeTrack());

    TrackPlayer.addEventListener('remote-pause', () => this.pauseTrack());

    TrackPlayer.addEventListener('remote-previous', () => this.playPreviousTrack());

    TrackPlayer.addEventListener('remote-next', () => this.playNextTrack());

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

    // TrackPlayer.addEventListener('remote-stop', () => TrackPlayer.destroy());
  }

  componentWillUnmount() {
    this.onPlayerUpdate.remove();
    this.onPlayerError.remove();
    this.onPlayerQueueEnded.remove();

    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  async componentDidUpdate(prev) {
    if (prev.lastAction != this.props.lastAction) {
      switch (this.props.lastAction.type) {
        case PLAY_TRACK:
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
        case 'recent':
          trackList = this.props.lastPlayed;
          break;
        case 'tip':
          trackList = this.props.lastTipped;
          break;
        default:
          break;
      }
    }
    return trackList;
  }

  render() {
    let showPlayer = true;
    if (FULLSCREEN_VIEWS.includes(this.props.currentScreen)) {
      showPlayer = false;
    }
    return (
        <View>
          {this.props.currentTrack && !this.props.settings.bigPlayer && showPlayer ?
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
                    <TouchableOpacity
                        onLongPress={() => {
                          if (!this.props.auth.loggedIn) {
                            NavigationService.navigate('Profile');
                          } else {
                            this._toggleTippingModal();
                          }
                        }}
                        onPress={() => this.props.tipTrack(this.props.currentTrack)}>
                      <Image
                          source={require('../assets/icons/clap-white.png')}
                          fadeDuration={0}
                          style={[{width: 20, height: 20}, styles.playerButton]}
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.playerState === TrackPlayer.STATE_BUFFERING ?
                      <ActivityIndicator style={{paddingHorizontal: 10, paddingVertical: 2}} size="small" color={Colors.fontColor}/> :
                      this.state.playerState === TrackPlayer.STATE_PLAYING ?
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
                  <TrackSlider/>
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', marginHorizontal: 8}}>
                    <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => this.props.toggleRepeat()}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-repeat` : 'md-repeat'}
                          size={Layout.isSmallDevice ? 20 : 40}
                          color={this.props.settings.repeat ? Colors.tintColor : Colors.fontColor}
                          style={styles.bigPlayerButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={!this.state.previousAllowed} style={{marginHorizontal: 5}} onPress={() => this.playPreviousTrack()}>
                      <Icon.MaterialIcons
                          name="skip-previous"
                          size={Layout.isSmallDevice ? 40 : 80}
                          color={this.state.previousAllowed ? Colors.fontColor : Colors.disabled}
                          style={styles.bigPlayerButton}
                      />
                    </TouchableOpacity>
                    {this.state.playerState === TrackPlayer.STATE_PLAYING ?
                        <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => this.pauseTrack()}>
                          <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `ios-pause` : 'md-pause'}
                              size={Layout.isSmallDevice ? 60 : 120}
                              color={Colors.fontColor}
                              style={styles.bigPlayerButtonn}
                          />
                        </TouchableOpacity> :
                        <TouchableOpacity disabled={this.state.playerState === TrackPlayer.STATE_BUFFERING} style={{marginHorizontal: 5}} onPress={() => this.resumeTrack()}>
                          <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `ios-play` : 'md-play'}
                              size={Layout.isSmallDevice ? 60 : 120}
                              color={this.state.playerState !== TrackPlayer.STATE_BUFFERING ? Colors.fontColor : Colors.disabled}
                              style={styles.bigPlayerButton}
                          />
                        </TouchableOpacity>}
                    <TouchableOpacity disabled={!this.state.nextAllowed} style={{marginHorizontal: 5}} onPress={() => this.playNextTrack()}>
                      <Icon.MaterialIcons
                          name="skip-next"
                          size={Layout.isSmallDevice ? 40 : 80}
                          color={this.state.nextAllowed ? Colors.fontColor : Colors.disabled}
                          style={styles.bigPlayerButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginHorizontal: 5}} onPress={() => {
                      this.props.toggleShuffle();
                    }}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? `ios-shuffle` : 'md-shuffle'}
                          size={Layout.isSmallDevice ? 20 : 40}
                          color={this.props.settings.shuffle ? Colors.tintColor : Colors.fontColor}
                          style={styles.bigPlayerButton}
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
                    <TouchableOpacity
                        style={{flex: 0.2, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginRight: 15}}
                        onPress={() => {
                          if (!this.props.auth.loggedIn) {
                            this.props.togglePlayerMode();
                          }
                          this.props.tipTrack(this.props.currentTrack);
                        }}
                        onLongPress={() => {
                          if (!this.props.auth.loggedIn) {
                            this.props.togglePlayerMode();
                            NavigationService.navigate('Profile');
                          } else {
                            this._toggleTippingModal();
                          }
                        }}>
                      <Image
                          source={require('../assets/icons/clap-white.png')}
                          fadeDuration={0}
                          style={{width: 16, height: 16, marginRight: 5}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 12}}>Tip</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this._toggleModal()} onBackButtonPress={() => this._toggleModal()}>
                  <View style={{backgroundColor: Colors.backgroundColor}}>
                    <View style={{flexDirection: 'row'}}>
                      <Image style={{width: 64, height: 64, margin: 16}} source={{uri: this.props.currentTrack.trackImg}}/>
                      <View style={{marginVertical: 16}}>
                        <TextTicker
                            style={{color: Colors.tintColor, fontSize: 16, width: 200}}
                            duration={5000}
                            loop
                            repeatSpacer={50}
                            marqueeDelay={1000}
                        >
                          {this.props.currentTrack.title}
                        </TextTicker>
                        <TextTicker
                            style={{color: '#8897A2', fontSize: 12, marginTop: 8, width: 200}}
                            duration={5000}
                            loop
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

                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => {
                          this._toggleModal();
                          this.props.tipTrack(this.props.currentTrack);
                        }}
                        onLongPress={() => {
                          this._toggleModal();
                          if (!this.props.auth.loggedIn) {
                            this.props.togglePlayerMode();
                            NavigationService.navigate('Profile');
                          } else {
                            setTimeout(() => {
                              this._toggleTippingModal();
                            }, 500);
                          }
                        }}>
                      <Image
                          source={require('../assets/icons/clap-grey.png')}
                          fadeDuration={0}
                          style={{width: 16, height: 16, marginRight: 16}}
                      />
                      <Text style={{color: Colors.fontColor, fontSize: 14}}>Tip track</Text>
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
          <TippingModal visible={this.state.isTippingModalVisible} track={this.props.currentTrack} toggleAction={() => this._toggleTippingModal()}/>
        </View>);
  }

  async loadAndPlayTrack(track) {
    let newTrack = {id: track.trackAddress, url: track.trackUrl, title: track.title, artist: track.artistName, artwork: track.trackImg};
    try {
      TrackPlayer.reset().then(function() {
        TrackPlayer.add(newTrack, null).then(function() {
          TrackPlayer.play().then(() => {
            updateOptions();
          });
        });
      });
    } catch (e) {
      console.log('audio failed to play');
      console.log(e);
      this.showAlert('', 'Hmm, we couldn’t play this track. Please try again in a moment.');
    }
  };

  async onPlaybackStatusUpdate(data) {
    this.setState({playerState: data.state});
  }

  onPlaybackError(data) {
    console.log(data);
    console.log(this.props.currentTrack.trackUrl);
    console.log(this.state.retries);
    if (this.state.retries < 3) {
      this.playNextTrack(true);
    }else{
      TrackPlayer.stop();
    }
    this.setState({retries: this.state.retries + 1});
    this.showAlert('', 'Hmm, we couldn’t play this track. Please try again in a moment.');
  }

  async onQueueEnded(data) {
    console.log(data);
    if (data.track && data.position != 0) {
      if (this.props.settings.repeat) {
        await TrackPlayer.seekTo(0);
        await TrackPlayer.play();
      } else {
        this.playNextTrack();
      }
    }
  }

  async pauseTrack() {
    await TrackPlayer.pause();
  }

  playPreviousTrack() {
    let trackList = this.props.lastPlayed;
    let index = returnIndexFromArray(trackList, this.props.currentTrack, true);
    if (trackList[index - 1]) {
      this.props.playTrack(trackList[index - 1], false);
    }
  }

  playNextTrack(afterError = false) {
    if (this.state.retries != 0 && !afterError) {
      this.setState({retries: 0});
    }
    let trackList = this.getTrackList();
    let index = returnIndexFromArray(trackList, this.props.currentTrack, false);
    if (this.props.settings.shuffle) {
      let newIndex = this.generateRandom(0, trackList.length - 1, index);
      if (trackList[newIndex]) {
        this.props.playTrack(trackList[newIndex], true);
      }
    } else {
      if (trackList[index + 1]) {
        this.props.playTrack(trackList[index + 1], true);
      }
    }
  }

  generateRandom(min, max, excludedValue) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return (num == excludedValue) ? this.generateRandom(min, max) : num;
  }

  async resumeTrack() {
    // play again if track has finished playing
    let position = await TrackPlayer.getPosition();
    if (position > 0) {
      await TrackPlayer.play();
    } else {
      this.props.playTrack(this.props.currentTrack, false);
    }
  }

  showAlert(title, text) {
    this.props.alertWithType('error', title, text);
  }

  _toggleTippingModal() {
    this.setState({isTippingModalVisible: !this.state.isTippingModalVisible});
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
    zIndex: 1,
  },
  playerButton: {
    marginHorizontal: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bigPlayerButton: {
    marginHorizontal: 4,
    paddingHorizontal: 4,
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