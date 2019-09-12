import React from 'react';
import {ScrollView, View, Text, Image, Platform, TouchableOpacity, Dimensions, StyleSheet, FlatList, RefreshControl, ActivityIndicator, ImageBackground} from 'react-native';
import * as Icon from '@expo/vector-icons';
import Colors from '../constants/Colors';
import {connect} from 'react-redux';
import Layout from '../constants/Layout';
import {getSearchByArtistResults, playTrack, followArtist} from '../actions';
import Track from '../components/track/track';
import {Button} from 'react-native-elements';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {fetchArtistDetailsJson} from '../actions/artist';
import {GENERAL_API_LIMIT} from '../constants/App';

const bannerHeight = 125;

class ArtistScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isLoaded: false};

  }

  componentDidMount() {
    const {navigation} = this.props;
    let artist = navigation.getParam('artist', null);
    if (!artist) {
      //fetch artist
      let profileAddress = navigation.getParam('profileAddress', null);
      this.getArtistDetails(profileAddress);

    } else {
      this.setState({artist, isLoaded: true});
      this.props.getSearchByArtistResults(artist.artistAddress);
    }
  }

  async getArtistDetails(profileAddress) {
    let artist = await fetchArtistDetailsJson(this.props.auth.accessToken, this.props.auth.email, profileAddress);
    this.setState({artist, isLoaded: true});
    this.props.getSearchByArtistResults(artist.artistAddress);
  }

  render() {
    return (
        this.state.isLoaded ?
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingHorizontal: 0}}>
              <View style={{marginBottom: 5, backgroundColor: '#272D33'}}>
                {this.state.artist ?
                    <ImageBackground source={{uri: this.state.artist.imageUrl}} style={{width: '100%', height: bannerHeight}} imageStyle={{resizeMode: 'cover'}}>
                      <View style={[{paddingHorizontal: 10, paddingTop: 24, height: bannerHeight}, styles.overlay]}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{justifyContent: 'center'}}>
                            <Icon.Ionicons
                                name={Platform.OS === 'ios' ? `md-arrow-back` : 'md-arrow-back'}
                                size={20}
                                color={Colors.fontColor}
                            />
                          </TouchableOpacity>
                          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
                            <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 18}}>{this.state.artist.artistName}</Text>
                          </View>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 10}}>
                          {/*<Image style={{width: 60, height: 60, paddingHorizontal: 16}} source={{uri: this.state.artist.imageUrl}}/>*/}
                          <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 8}}>
                              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Icon.Ionicons
                                    name={Platform.OS === 'ios' ? 'md-people' : 'md-people'}
                                    size={14}
                                    color={Colors.fontColor}
                                    style={{margin: 5}}
                                />
                                <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 12}}>{this.state.artist.followers ? this.state.artist.followers : 0}</Text>
                              </View>
                              <View style={{flexDirection: 'row', marginHorizontal: 10, justifyContent: 'center', alignItems: 'center'}}>
                                <Image
                                    source={require('../assets/icons/tip-white.png')}
                                    fadeDuration={0}
                                    style={{width: 10, height: 10, marginRight: 5}}
                                />
                                <Text numberOfLines={1} style={{color: Colors.fontColor, fontSize: 12}}>{this.state.artist.tipCount ? this.state.artist.tipCount : 0}</Text>
                              </View>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                              <Button
                                  icon={
                                    <Icon.Ionicons
                                        name={Platform.OS === 'ios' ? 'ios-play' : 'md-play'}
                                        size={14}
                                        color={Colors.fontColor}
                                    />
                                  }
                                  title='PLAY'
                                  disabled={this.props.searchResultsByArtist.length == 0}
                                  disabledStyle={{backgroundColor: Colors.disabled}}
                                  buttonStyle={{
                                    backgroundColor: Colors.tintColor,
                                    borderColor: 'transparent',
                                    borderWidth: 0,
                                    paddingHorizontal: 12,
                                    paddingVertical: 0,
                                    maxWidth: 100,
                                    marginRight: 4,
                                  }}
                                  titleStyle={{fontSize: 12, color: Colors.fontColor, fontWeight: 'bold'}}
                                  onPress={() => this.props.searchResultsByArtist.length > 0 ? this.props.playTrack(this.props.searchResultsByArtist[0], true) : console.log('no tracks')}
                              />
                              <Button
                                  title={this.state.artist.followed ? 'Following' : 'Follow'}
                                  buttonStyle={{
                                    backgroundColor: 'transparent',
                                    borderColor: this.state.artist.followed ? Colors.disabled : Colors.tintColor,
                                    borderWidth: 1,
                                    paddingHorizontal: 12,
                                    paddingVertical: 0,
                                    maxWidth: 100,
                                    marginHorizontal: 4,
                                    elevation: 0,
                                  }}
                                  titleStyle={{fontSize: 10, color: this.state.artist.followed ? Colors.disabled : Colors.tintColor, fontWeight: 'bold'}}
                                  onPress={() => {
                                    this.props.followArtist(this.state.artist, this.state.artist.followed ? false : true);
                                    if (this.props.auth.loggedIn) {
                                      this.setState({artist: {...this.state.artist, followed: !this.state.artist.followed}});
                                    }
                                  }}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </ImageBackground>
                    :
                    <View style={{paddingHorizontal: 10, paddingTop: 24, paddingBottom: 5, backgroundColor: '#272D33'}}>
                      <Icon.Ionicons
                          name={'ios-star'}
                          size={50}
                          color={Colors.tabIconDefault}
                          style={{opacity: 0.5}}
                      />
                      <Text style={{color: Colors.tabIconDefault, fontFamily: 'robotoMedium', fontSize: 16, marginTop: 24}}>Ooops, we couldn’t find what you’re looking for.</Text>
                    </View>}
              </View>

              <View style={[styles.trackContainer, {marginTop: 0}]}>
                <FlatList
                    data={this.props.searchResultsByArtist}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={{}}
                    refreshControl={
                      <RefreshControl
                          refreshing={this.props.loading.SEARCH_BY_ARTIST && this.props.searchResultsByArtist.length == 0}
                          onRefresh={() => this.props.getSearchByArtistResults(this.state.artist.artistAddress, 0)}
                          tintColor={Colors.tintColor}
                      />
                    }
                    ListEmptyComponent={!this.props.loading.SEARCH_BY_ARTIST ? <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                      <Text style={{color: Colors.tabIconDefault}}>No releases found</Text>
                    </View> : null}
                    ListFooterComponent={
                      this.props.loading.SEARCH_BY_ARTIST && this.props.searchResultsByArtist.length >= GENERAL_API_LIMIT ?
                          <ActivityIndicator size="small" color={Colors.tintColor} style={{marginTop: 10}}/> :
                          null}
                    onEndReached={() => {
                      !this.props.loading.SEARCH_BY_ARTIST && this.props.searchResultsByArtist.length >= GENERAL_API_LIMIT ?
                          this.props.getSearchByArtistResults(this.state.artist.artistAddress, this.props.searchResultsByArtist.length) :
                          null;
                    }}
                    initialNumToRender={5}
                    onEndReachedThreshold={1.5}
                />
              </View>
            </View>
            :
            <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingHorizontal: 0, paddingTop: getStatusBarHeight(true), paddingBottom: 20, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}}>
              <ActivityIndicator size="small" color={Colors.tintColor} style={{marginTop: 10}}/>
            </View>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Track track={item} origin="artist"/>
  );

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0,0.5)',
  },
  trackContainer: {
    flex: 1,
  },
});

export default connect(mapStateToProps, {getSearchByArtistResults, playTrack, followArtist})(ArtistScreen);

