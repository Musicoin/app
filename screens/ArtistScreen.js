import React from 'react';
import {ScrollView, View, Text, Image, Platform, TouchableOpacity, ImageBackground, Dimensions, StyleSheet, StatusBar, FlatList, RefreshControl} from 'react-native';
import {Icon} from 'expo';
import Colors from '../constants/Colors';
import {connect} from 'react-redux';
import Layout from '../constants/Layout';
import {getSearchByArtistResults, playTrack} from '../actions';
import Track from '../components/track/track';
import {Button} from 'react-native-elements';

var {width} = Dimensions.get('window');

class ArtistScreen extends React.Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    const artist = navigation.getParam('artist', null);
    this.state = {artist};
    this.props.getSearchByArtistResults(artist.artistId);
  }

  render() {

    return (
        <ScrollView style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingHorizontal: 0, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, paddingBottom: 20, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}}>

          <View style={{paddingHorizontal: 10, paddingTop: 24, paddingBottom: 5, backgroundColor: '#272D33'}}>
            <TouchableOpacity style={{marginHorizontal: 16, marginTop: 16}} onPress={() => this.props.navigation.goBack()}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? `md-arrow-back` : 'md-arrow-back'}
                  size={26}
                  color={Colors.fontColor}
              />
            </TouchableOpacity>
            <View style={{alignItems: 'center', marginBottom: 20, paddingVertical: 5, paddingTop: 10}}>
              <Image style={{width: 104, height: 104, borderRadius: 52}} source={{uri: this.state.artist.imageUrl}}/>
              <Text style={{fontSize: 16, color: Colors.fontColor, paddingTop: 8}}>{this.state.artist.artistName}</Text>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', marginHorizontal: 10, marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <Icon.Ionicons
                      name={Platform.OS === 'ios' ? 'md-people' : 'md-people'}
                      size={12}
                      color={Colors.fontColor}
                      style={{margin: 5}}
                  />
                  <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{this.state.artist.followers}</Text>
                </View>
                <View style={{flexDirection: 'row', marginHorizontal: 10, marginTop: 5, justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                      source={require('../assets/icons/clap-white.png')}
                      fadeDuration={0}
                      style={{width: 10, height: 10, marginRight: 5}}
                  />
                  <Text numberOfLines={1} style={{color: '#8897A2', fontSize: 10}}>{this.state.artist.tipTotal}</Text>
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

          <View style={styles.trackContainer}>
            <FlatList
                data={this.props.searchResultsByArtist}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                style={{flex: 1}} contentContainerStyle={{paddingTop: 0}}
                refreshControl={
                  <RefreshControl
                      refreshing={this.props.loading.SEARCH_BY_ARTIST}
                      onRefresh={() => this.props.getSearchByArtistResults(this.state.artist.artistId)}
                      tintColor={Colors.tintColor}
                  />
                }
                ListEmptyComponent={!this.props.loading.SEARCH_BY_ARTIST ? <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: Colors.tabIconDefault}}>No releases found</Text>
                </View> : null}
            />
          </View>
        </ScrollView>
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

