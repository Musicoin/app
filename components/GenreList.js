import React from 'react';
import {View, Text, FlatList, StyleSheet, StatusBar, Platform, TouchableOpacity} from 'react-native';
import {genres} from '../constants/Data';
import Layout from '../constants/Layout';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import {getColorCodeForString} from '../tools/util';
import NavigationService from '../services/NavigationService';
import {getSearchByGenreResults} from '../actions';

class GenreList extends React.Component {

  render() {
    return (
        <FlatList
            data={genres}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            ListHeaderComponent={<View style={{marginTop: 30, marginBottom: 15, marginHorizontal: 10}}><Text style={{fontSize: 18, color: '#F4F7FB'}}>Discover</Text>
              <Text style={{fontSize: 14, color: '#8897A2'}}>Explore your favorite genres</Text></View>}
            numColumns={2}
            style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
        />
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <TouchableOpacity style={{flex: 1}} onPress={()=>this.searchTracks(item)}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 72, margin: 10, backgroundColor: '#2E343A'}}>
          <Text style={{color: 'white', fontSize: 14}}>{item}</Text>
        </View>
      </TouchableOpacity>
  );

  searchTracks(genre){
    this.props.getSearchByGenreResults(genre, 0);
    NavigationService.navigate('GenreScreen', {genre})
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

export default connect(mapStateToProps, {getSearchByGenreResults})(GenreList);
