import React from 'react';
import {ScrollView, View, Text, Image, Platform, TouchableOpacity, Dimensions, StyleSheet, FlatList, RefreshControl, ActivityIndicator} from 'react-native';
import {Icon} from 'expo';
import Colors from '../constants/Colors';
import {connect} from 'react-redux';
import Layout from '../constants/Layout';
import {getSearchByArtistResults, playTrack} from '../actions';
import Track from '../components/track/track';
import {Button} from 'react-native-elements';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {fetchArtistDetailsJson} from '../actions/artist';
import {GENERAL_API_LIMIT} from '../constants/App';

var {width} = Dimensions.get('window');

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
                    <View>
                      <View style={{paddingHorizontal: 10, paddingTop: 24}}>
                        <TouchableOpacity style={{marginHorizontal: 16, marginTop: 16}} onPress={() => this.props.navigation.goBack()}>
                          <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `md-arrow-back` : 'md-arrow-back'}
                              size={26}
                              color={Colors.fontColor}
                          />
                        </TouchableOpacity>
                        <View style={{alignItems: 'center', marginBottom: 20, paddingVertical: 5, paddingTop: 10}}>
                          <Image style={{width: Layout.isSmallDevice ? 104 : 208, height: Layout.isSmallDevice ? 104 : 208, borderRadius: Layout.isSmallDevice ? 52 : 104}} source={{uri: this.state.artist.imageUrl}}/>
                          <Text style={{fontSize: 16, color: Colors.fontColor, paddingTop: 8}}>{this.state.artist.artistName}</Text>
                          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <View style={{flexDirection: 'row', marginHorizontal: 10, marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                              <Icon.Ionicons
                                  name={Platform.OS === 'ios' ? 'md-people' : 'md-people'}
                                  size={12}
                                  color={Colors.fontColor}
                                  style={{margin: 5}}
                              />
                              <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{this.state.artist.followers ? this.state.artist.followers : 0}</Text>
                            </View>
                            <View style={{flexDirection: 'row', marginHorizontal: 10, marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                              <Image
                                  source={require('../assets/icons/clap-white.png')}
                                  fadeDuration={0}
                                  style={{width: 10, height: 10, marginRight: 5}}
                              />
                              <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{this.state.artist.tipTotal ? this.state.artist.tipTotal : 0}</Text>
                            </View>
                          </View>
                          <View>
                            <Button
                                icon={
                                  <Icon.Ionicons
                                      name={Platform.OS === 'ios' ? 'ios-play' : 'md-play'}
                                      size={20}
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
                                  borderRadius: Platform.OS === 'ios' ? 20 : 0,
                                  paddingHorizontal: 24,
                                }}
                                titleStyle={{fontSize: 16, color: Colors.fontColor}}
                                containerStyle={{marginTop: 20}}
                                onPress={() => this.props.searchResultsByArtist.length > 0 ? this.props.playTrack(this.props.searchResultsByArtist[0], true) : console.log('no tracks')}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
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
                          null
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
    backgroundColor: 'rgba(0, 0, 0,0.3)',
  },
  trackContainer: {
    flex: 1,
  },
});

export default connect(mapStateToProps, {getSearchByArtistResults, playTrack})(ArtistScreen);

