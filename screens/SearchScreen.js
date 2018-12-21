import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform, FlatList, RefreshControl, SectionList, TouchableOpacity} from 'react-native';
import Colors from '../constants/Colors';
import {SearchBar} from 'react-native-elements';
import GenreList from '../components/GenreList';

import {connect} from 'react-redux';
import {getSearchResults} from '../actions';
import Layout from '../constants/Layout';
import Track from '../components/track/track';
import Artist from '../components/Artist';

let numArtists = 3;
let numTracks = 4;

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searching: false, artistsExpanded: false, releasesExpanded: false};
  }

  render() {
    return (
        <View style={styles.container}>
          <SearchBar
              ref={search => this.searchBox = search}
              autoCorrect={false}
              platform="android"
              clearIcon={{color: Colors.fontColor}}
              searchIcon={{color: Colors.fontColor}}
              cancelIcon={null}
              onChangeText={(text) => {
                this.text = text;
                clearTimeout(this.timeout); // clears the old timer
                this.timeout = setTimeout(() => this.search(), 500);
              }}
              onClear={() => this.clear()}
              placeholder='Search'
              placeholderTextColor='#53626D'
              inputStyle={{
                backgroundColor: '#30353B',
                color: Colors.fontColor,
              }}
              containerStyle={{
                backgroundColor: '#30353B',
                borderTopWidth: 0,
                borderBottomWidth: 0,
              }}
          />
          {this.state.searching ?
              <SectionList
                  initialNumToRender={5}
                  keyExtractor={this._keyExtractor}
                  stickySectionHeadersEnabled={false}
                  style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
                  renderSectionHeader={({section}) => {
                    if (!this.props.loading.SEARCH) {
                      if ((section.title === 'Artists' && this.props.searchResults.artists.length > 0) || (section.title === 'Tracks' && this.props.searchResults.releases.length > 0)) {
                        return (
                            <View style={{marginHorizontal: 16, marginTop: 40, marginBottom: 16}}>
                              <Text style={{fontSize: 16, color: '#F4F7FB'}}>{section.title}</Text>
                            </View>
                        );
                      }
                    }
                  }}
                  renderSectionFooter={({section}) => {
                    if (!this.props.loading.SEARCH) {
                      if (section.title === 'Artists') {
                        if (this.props.searchResults.artists.length > numArtists) {
                          return (
                              <View style={{marginHorizontal: 16, height: 32, alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => this.toggleMore(section.title)}>
                                  <Text style={{fontSize: 12, color: '#707070'}}>{this.state.artistsExpanded ? 'see less artists' : 'see more artists'}</Text>
                                </TouchableOpacity>
                              </View>
                          );
                        }
                      }
                      if (section.title === 'Tracks') {
                        if (this.props.searchResults.releases.length > numTracks) {
                          return (
                              <View style={{marginHorizontal: 16, height: 32, alignItems: 'center', justifyContent: 'center'}}>
                                <TouchableOpacity onPress={() => this.toggleMore(section.title)}>
                                  <Text style={{fontSize: 12, color: '#707070'}}>{this.state.releasesExpanded ? 'see less tracks' : 'see more tracks'}</Text>
                                </TouchableOpacity>
                              </View>
                          );
                        }

                        if (this.props.searchResults.releases.length == 0 && this.props.searchResults.artists.length == 0) {
                          return (
                              <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{color: Colors.tabIconDefault}}>No results</Text>
                              </View>
                          );
                        }
                      }
                    }
                  }}
                  sections={[
                    {
                      title: 'Artists', data: this.state.artistsExpanded ? this.props.searchResults.artists : this.props.searchResults.artists.slice(0, numArtists),
                      renderItem: this._renderArtistItem,
                    },
                    {
                      title: 'Tracks', data: this.state.releasesExpanded ? this.props.searchResults.releases : this.props.searchResults.releases.slice(0, numTracks),
                      renderItem: this._renderItem,
                    },
                  ]}
                  refreshControl={
                    <RefreshControl
                        refreshing={this.props.loading.SEARCH}
                        onRefresh={() => this.search()}
                        tintColor={Colors.tintColor}
                    />}
                  ListEmptyComponent={!this.props.loading.SEARCH ? <View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: Colors.tabIconDefault}}>Seems like you played the wrong note!</Text>
                  </View> : null}
              />
              :
              <GenreList/>
          }
        </View>
    );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  search() {
    if (this.text !== '') {
      this.setState({searching: true});
      this.props.getSearchResults(this.text);
    }
  }

  clear() {
    console.log('clear');
    this.searchBox.cancel();
    this.setState({searching: false});
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Track track={item} origin="search"/>
  );

  _renderArtistItem = ({item}) => (
      <Artist artist={item}/>
  );

  toggleMore(sectionTitle) {
    if (sectionTitle === 'Artists') {
      this.setState({artistsExpanded: !this.state.artistsExpanded});
    }

    if (sectionTitle === 'Tracks') {
      this.setState({releasesExpanded: !this.state.releasesExpanded});
    }
  }

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
});

export default connect(mapStateToProps, {getSearchResults})(SearchScreen);