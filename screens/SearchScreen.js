import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform, FlatList, RefreshControl} from 'react-native';
import Colors from '../constants/Colors';
import {SearchBar} from 'react-native-elements';

import {connect} from 'react-redux';
import {getSearchResults} from '../actions';
import Layout from '../constants/Layout';
import Track from '../components/track/track';

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searching: false};
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
              cancelIcon={{color: Colors.fontColor}}
              onChangeText={(text) => {
                this.text = text;
                clearTimeout(this.timeout); // clears the old timer
                this.timeout = setTimeout(() => this.search(), 500);
              }}
              onClear={() => this.clear()}
              onCancel={() => this.cancel()}
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
                    />}
                  ListEmptyComponent={!this.props.loading.SEARCH?<View style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: Colors.tabIconDefault}}>Seems like you played the wrong note!</Text>
                  </View>: null}
              />
              : <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: 'white'}}>[Categories]</Text>
              </View>
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
  }

  cancel() {
    console.log('cancel');
    this.searchBox.clear();
    this.setState({searching: false});
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Track track={item} origin="search"/>
  );

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