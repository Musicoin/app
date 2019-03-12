import React, {Component} from 'react';
import {View, Text, Platform, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'expo';
import {connect} from 'react-redux';
import {playTrack, addToQueue, removeFromQueue, tipTrack} from '../../actions';
import Colors from '../../constants/Colors';
import Modal from 'react-native-modal';
import TextTicker from 'react-native-text-ticker';
import NavigationService from '../../services/NavigationService';
import {shareTrack} from '../../tools/util';
import TippingModal from '../../components/TippingModal';

class Track extends Component {
  constructor(props) {
    super(props);
    this.state = {isModalVisible: false, isTippingModalVisible: false};
  }

  _toggleModal() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  _toggleTippingModal() {
    this.setState({isTippingModalVisible: !this.state.isTippingModalVisible});
  }

  render() {
    let item = this.props.track;
    let origin = this.props.origin;
    return (
        <View>
          <View style={styles.trackContainer}>
            <TouchableOpacity style={styles.albumArtContainer} onPress={() => this.props.playTrack(item)}>
              <Image style={{width: 56, height: 56}} source={{uri: item.trackImg}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.releaseTrackContainer} onPress={() => this.props.playTrack(item)}>
              <Text numberOfLines={1} style={{color: Colors.fontColor}}>{item.title}</Text>
              <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{item.artistName}</Text>
              <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{item.directTipCount} {item.directTipCount == 1 ? 'tip' : 'tips'}</Text>
            </TouchableOpacity>
            <View style={styles.optionsButton}>
              <TouchableOpacity style={{padding: 20}} onPress={() => this.setState({isModalVisible: true})}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? 'md-more' : 'md-more'}
                    size={22}
                    color={Colors.fontColor}
                    style={styles.playerButton}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this._toggleModal()} onBackButtonPress={() => this._toggleModal()}>
            <View style={{backgroundColor: Colors.backgroundColor}}>
              <View style={{flexDirection: 'row'}}>
                <Image style={{width: 64, height: 64, margin: 16}} source={{uri: item.trackImg}}/>
                <View style={{marginVertical: 16}}>
                  <TextTicker
                      style={{color: Colors.tintColor, fontSize: 16, width: 200}}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}
                  >
                    {item.title}
                  </TextTicker>
                  <TextTicker
                      style={{color: '#8897A2', fontSize: 12, marginTop: 8, width: 200}}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}
                  >
                    {item.artistName}
                  </TextTicker>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: '#2E343A'}}>
              {origin !== 'queue' ?
                  <TouchableOpacity style={styles.modalButton} onPress={() => {
                    this._toggleModal();
                    this.props.addToQueue(item);
                  }}>
                    <Icon.Ionicons
                        name={Platform.OS === 'ios' ? 'ios-add' : 'md-add'}
                        size={24}
                        color={'#8897A2'}
                        style={{marginRight: 16}}
                    />
                    <Text style={{color: Colors.fontColor, fontSize: 14}}>Add to queue</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity style={styles.modalButton} onPress={() => {
                    this._toggleModal();
                    this.props.removeFromQueue(item.queueId);
                  }}>
                    <Icon.Ionicons
                        name={Platform.OS === 'ios' ? 'ios-remove' : 'md-remove'}
                        size={24}
                        color={'#8897A2'}
                        style={{marginRight: 16}}
                    />
                    <Text style={{color: Colors.fontColor, fontSize: 14}}>Remove from queue</Text>
                  </TouchableOpacity>}

              <TouchableOpacity style={styles.modalButton} onPress={() => {
                this._toggleModal();
                NavigationService.navigate('ReleaseDetail', {trackAddress: item.trackAddress, origin});
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
                    this.props.tipTrack(item);
                  }}
                  onLongPress={() => {
                    this._toggleModal();
                    if (!this.props.auth.loggedIn) {
                      NavigationService.navigate('Profile');
                    } else {
                      setTimeout(() => {
                        this._toggleTippingModal();
                      }, 500);
                    }
                  }}>
                <Image
                    source={require('../../assets/icons/clap-grey.png')}
                    fadeDuration={0}
                    style={{width: 16, height: 16, marginRight: 16}}
                />
                <Text style={{color: Colors.fontColor, fontSize: 14}}>Tip track</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    this._toggleModal();
                    NavigationService.navigate('ArtistScreen', {profileAddress: item.artistAddress});
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
                shareTrack(item).then(console.log('shared'));
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
          <TippingModal visible={this.state.isTippingModalVisible} track={item} toggleAction={() => this._toggleTippingModal()}/>
        </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  trackContainer: {
    flexDirection: 'row',
  },
  albumArtContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  releaseTrackContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  optionsButton: {
    justifyContent: 'center',
  },
  modalButton: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerButton: {},
});

export default connect(mapStateToProps, {playTrack, addToQueue, removeFromQueue, tipTrack})(Track);