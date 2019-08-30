import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform, FlatList, RefreshControl, SectionList, TouchableOpacity, ActivityIndicator} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import Colors from '../constants/Colors';
import {SearchBar} from 'react-native-elements';
import GenreList from '../components/GenreList';
import * as Icon from '@expo/vector-icons';
import {connect} from 'react-redux';
import {getSearchResults} from '../actions';
import Layout from '../constants/Layout';
import Track from '../components/track/track';
import Artist from '../components/Artist';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';

let numArtists = 3;
let numTracks = 3;

const _renderItem = ({item}) => (
    <Track track={item} origin="search"/>
);

const _renderArtistItem = ({item}) => (
    <Artist artist={item}/>
);

const _keyExtractor = (item, index) => index.toString();

const AllResults = (props) => (
    <SectionList
        initialNumToRender={5}
        keyExtractor={_keyExtractor}
        stickySectionHeadersEnabled={false}
        style={{flex: 1, marginBottom: props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
        renderSectionHeader={({section}) => {
          if (!props.loading) {
            if ((section.title === 'Artists' && props.searchResults.artists.length > 0) || (section.title === 'Tracks' && props.searchResults.releases.length > 0)) {
              return (
                  <View style={{marginHorizontal: 16, marginTop: 40, marginBottom: 16}}>
                    <Text style={{fontSize: 16, color: '#F4F7FB'}}>{section.title}</Text>
                  </View>
              );
            }
          }
        }}
        renderSectionFooter={({section}) => {
          if (!props.loading) {
            if (section.title === 'Artists') {
              if (props.searchResults.artists.length > numArtists) {
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
              if (props.searchResults.releases.length > numTracks) {
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
            title: 'Artists', data: props.searchResults.artists.slice(0, numArtists),
            renderItem: _renderArtistItem,
          },
          {
            title: 'Tracks', data: props.searchResults.releases.slice(0, numTracks),
            renderItem: _renderItem,
          },
        ]}
        refreshControl={
          <RefreshControl
              refreshing={props.loading}
              onRefresh={() => this.search()}
              tintColor={Colors.tintColor}
          />}
    />
);

 const Artists = (props) => (
    <FlatList
        data={props.artists}
        keyExtractor={_keyExtractor}
        renderItem={_renderArtistItem}
        style={{flex: 1, marginBottom: props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
              refreshing={props.loading}
              onRefresh={() => this.search()}
              tintColor={Colors.tintColor}
          />
        }
        ListEmptyComponent={!props.loading ? <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center'}}>
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

 const Tracks = (props) => (
    <FlatList
        data={props.releases}
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        style={{flex: 1, marginBottom: props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
              refreshing={props.loading}
              onRefresh={() => this.search()}
              tintColor={Colors.tintColor}
          />
        }
        ListEmptyComponent={!props.loading ? <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center'}}>
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
                          renderScene = {this.renderScene}
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

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'all':
        return <AllResults searchResults={this.props.searchResults} loading={this.props.loading.SEARCH} currentTrack={this.props.currentTrack}/>;
      case 'artists':
        return <Artists artists={this.props.searchResults.artists} loading={this.props.loading.SEARCH} currentTrack={this.props.currentTrack}/>;
      case 'tracks':
        return <Tracks releases={this.props.searchResults.releases} loading={this.props.loading.SEARCH} currentTrack={this.props.currentTrack}/>;
      default:
        return null;
    }
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