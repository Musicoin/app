import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform, FlatList, RefreshControl, SectionList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import Colors from '../constants/Colors';
import {SearchBar} from 'react-native-elements';
import GenreList from '../components/GenreList';
import {Icon} from 'expo';
import {connect} from 'react-redux';
import {getSearchResults} from '../actions';
import Layout from '../constants/Layout';
import Track from '../components/track/track';
import Artist from '../components/Artist';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

let numArtists = 3;
let numTracks = 3;

class SearchScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searching: false,
      index: 0,
      route: 'all',
      routes: [
        {key: 'all', title: 'ALL'},
        {key: 'artists', title: 'ARTISTS'},
        {key: 'tracks', title: 'TRACKS'},
      ],
    };
  }

  _renderAllResults = () => (
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
                        <TouchableOpacity onPress={() => this.seeMore(section.title)}>
                          <Text style={{fontSize: 12, color: '#707070'}}>{'see more artists'}</Text>
                        </TouchableOpacity>
                      </View>
                  );
                }
              }
              if (section.title === 'Tracks') {
                if (this.props.searchResults.releases.length > numTracks) {
                  return (
                      <View style={{marginHorizontal: 16, height: 32, alignItems: 'center', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => this.seeMore(section.title)}>
                          <Text style={{fontSize: 12, color: '#707070'}}>{'see more tracks'}</Text>
                        </TouchableOpacity>
                      </View>
                  );
                }
              }
            }
          }}
          sections={[
            {
              title: 'Artists', data: this.props.searchResults.artists.slice(0, numArtists),
              renderItem: this._renderArtistItem,
            },
            {
              title: 'Tracks', data: this.props.searchResults.releases.slice(0, numTracks),
              renderItem: this._renderItem,
            },
          ]}
          refreshControl={
            <RefreshControl
                refreshing={this.props.loading.SEARCH}
                onRefresh={() => this.search()}
                tintColor={Colors.tintColor}
            />}
      />
  );

  _renderArtists = () => (
      <FlatList
          data={this.props.searchResults.artists}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderArtistItem}
          style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
                refreshing={this.props.loading.SEARCH}
                onRefresh={() => this.search()}
                tintColor={Colors.tintColor}
            />
          }
          ListEmptyComponent={!this.props.loading.SEARCH ? <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center'}}>
            <Icon.Ionicons
                name={'ios-search'}
                size={50}
                color={Colors.tabIconDefault}
                style={{opacity: 0.5}}
            />
            <Text style={{color: Colors.tabIconDefault, fontFamily: 'robotoMedium', fontSize: 16, marginTop: 24}}>Ooops, we couldn’t find what you’re looking for.</Text>
          </View> : null}
      />
  );

  _renderTracks = () => (
      <FlatList
          data={this.props.searchResults.releases}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
                refreshing={this.props.loading.SEARCH}
                onRefresh={() => this.search()}
                tintColor={Colors.tintColor}
            />
          }
          ListEmptyComponent={!this.props.loading.SEARCH ? <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center'}}>
            <Icon.Ionicons
                name={'ios-search'}
                size={50}
                color={Colors.tabIconDefault}
                style={{opacity: 0.5}}
            />
            <Text style={{color: Colors.tabIconDefault, fontFamily: 'robotoMedium', fontSize: 16, marginTop: 24}}>Ooops, we couldn’t find what you’re looking for.</Text>
          </View> : null}
      />
  );

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
                if (this.timeout) {
                  clearTimeout(this.timeout); // clears the old timer
                }
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
              !this.props.loading.SEARCH ?
                  this.props.searchResults.releases.length > 0 || this.props.searchResults.artists.length > 0 ?
                      <TabView
                          navigationState={this.state}
                          renderScene={SceneMap({
                            all: this._renderAllResults,
                            artists: this._renderArtists,
                            tracks: this._renderTracks,
                          })}
                          renderTabBar={this._renderTabBar}
                          onIndexChange={index => this.setState({index, route: this.state.routes[index].key})}
                          initialLayout={{width: Layout.window.width, height: Layout.window.height}}
                      /> :
                      <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon.Ionicons
                            name={'ios-search'}
                            size={50}
                            color={Colors.tabIconDefault}
                            style={{opacity: 0.5}}
                        />
                        <Text style={{color: Colors.tabIconDefault, fontFamily: 'robotoMedium', fontSize: 16, marginTop: 24}}>Ooops, we couldn’t find what you’re looking for.</Text>
                      </View>
                  : <ActivityIndicator size="small" color={Colors.tintColor} style={{marginTop: 10}}/>
              :
              <GenreList/>
          }
        </View>
    );
  }

  _renderTabBar = props => {
    return (
        <TabBar
            {...props}
            indicatorStyle={{backgroundColor: Colors.tintColor, color: Colors.tintColor}}
            style={{backgroundColor: Colors.backgroundColor}}
            renderLabel={this._renderLabel}
        />
    );
  };

  _renderLabel = scene => {
    const label = scene.route.title;
    return <Text style={{color: scene.route.key === this.state.route ? Colors.tintColor : Colors.tabIconDefault, fontSize: 14}}>{label}</Text>;
  };

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  search() {
    if (this.text !== '') {
      this.setState({searching: true});
      this.props.getSearchResults(this.text);
    }
  }

  clear() {
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

  seeMore(sectionTitle) {
    if (sectionTitle === 'Artists') {
      this.setState({index: 1, route: this.state.routes[1].key});
    }

    if (sectionTitle === 'Tracks') {
      this.setState({index: 2, route: this.state.routes[2].key});
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
    paddingTop: getStatusBarHeight(true),
  },
});

export default connect(mapStateToProps, {getSearchResults})(SearchScreen);