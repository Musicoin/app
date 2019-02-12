import React, {Component} from 'react';
import {View, Text, Platform, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'expo';
import {connect} from 'react-redux';
import {playTrack, addToQueue, removeFromQueue, addAlert} from '../actions';
import Colors from '../constants/Colors';

import Modal from 'react-native-modal';
import TextTicker from 'react-native-text-ticker';
import NavigationService from '../services/NavigationService';

import {shareArtist} from '../tools/util';

class Artist extends Component {

  constructor(props) {
    super(props);
    this.state = {isModalVisible: false};
  }

  _toggleModal() {
    this.setState({isModalVisible: !this.state.isModalVisible});
  }

  render() {
    let item = this.props.artist;
    return (
        <View>
          <View style={styles.container}>
            <TouchableOpacity style={styles.albumArtContainer} onPress={() => NavigationService.navigate('ArtistScreen', {artist: item})}>
              <Image imageResizeMode={'cover'} style={{width: 56, height: 56, borderRadius: 28}} source={{uri: item.imageUrl}}/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.artistInfoContainer} onPress={() => NavigationService.navigate('ArtistScreen', {artist: item})}>
              <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 14}}>{item.artistName}</Text>
              <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{item.followers} {item.followers == 1 ? 'follower' : 'followers'}</Text>
            </TouchableOpacity>

            <View style={styles.optionsButton}>
              <TouchableOpacity style={{padding: 20}} onPress={() => this._toggleModal()}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? 'md-more' : 'md-more'}
                    size={22}
                    color={Colors.fontColor}
                    style={styles.playerButton}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this._toggleModal()} onBackButtonPress={()=>this._toggleModal()}>
            <View style={{backgroundColor: Colors.backgroundColor}}>
              <View style={{flexDirection: 'row'}}>
                <Image style={{width: 64, height: 64, margin: 16}} source={{uri: item.imageUrl}}/>
                <View style={{marginVertical: 16}}>
                  <TextTicker
                      style={{color: Colors.tintColor, fontSize: 16, width: 200}}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}
                  >
                    {item.artistName}
                  </TextTicker>
                  <TextTicker
                      style={{color: '#8897A2', fontSize: 12, marginTop: 8, width: 200}}
                      duration={5000}
                      loop
                      bounce
                      repeatSpacer={50}
                      marqueeDelay={1000}
                  >
                    {item.followers} {item.followers == 1 ? 'follower' : 'followers'}
                  </TextTicker>
                </View>
              </View>
            </View>
            <View style={{backgroundColor: '#2E343A'}}>


              <TouchableOpacity style={styles.modalButton} onPress={() => {
                this._toggleModal();
                NavigationService.navigate('ArtistScreen', {artist: item});
              }}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? 'ios-eye' : 'md-eye'}
                    size={24}
                    color={'#8897A2'}
                    style={{marginRight: 16}}
                />
                <Text style={{color: Colors.fontColor, fontSize: 14}}>Artist details</Text>
              </TouchableOpacity>


              <TouchableOpacity style={styles.modalButton} onPress={() => {
                shareArtist(item).then(console.log('shared'));
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
        </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  albumArtContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  artistInfoContainer: {
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

export default connect(mapStateToProps, {playTrack, addToQueue, removeFromQueue, addAlert})(Artist);