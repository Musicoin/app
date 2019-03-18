import React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  FlatList,
  StatusBar,
  RefreshControl,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import connectAlert from '../components/alert/connectAlert.component';
import Track from '../components/track/track';
import {getSearchByGenreResults} from '../actions';
import Layout from '../constants/Layout';
import {Icon} from 'expo';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {GENERAL_API_LIMIT} from '../constants/App';

class GenreScreen extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {navigation} = this.props;
    const genre = navigation.getParam('genre', null);
    return (
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor, paddingTop: getStatusBarHeight(true)}}>
          <View style={{flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10, alignItems: 'stretch'}}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Icon.Ionicons
                  name={Platform.OS === 'ios' ? `ios-arrow-back` : 'md-arrow-back'}
                  size={26}
                  color={Colors.fontColor}
              />
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: 'white', fontSize: 18}}>{genre}</Text>
            </View>
          </View>
          <FlatList
              data={this.props.searchResultsByGenre}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              style={{flex: 1, marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}} contentContainerStyle={styles.contentContainer}
              refreshControl={
                <RefreshControl
                    refreshing={this.props.loading.SEARCH_BY_GENRE && this.props.searchResultsByGenre.length == 0}
                    onRefresh={() => this.props.getSearchByGenreResults(genre, 0)}
                    tintColor={Colors.tintColor}
                />
              }
              ListEmptyComponent={!this.props.loading.SEARCH_BY_GENRE ? <View style={{marginTop: 100, alignItems: 'center', justifyContent: 'center'}}>
                <Icon.Ionicons
                    name={'ios-search'}
                    size={50}
                    color={Colors.tabIconDefault}
                    style={{opacity: 0.5}}
                />
                <Text style={{color: Colors.tabIconDefault, fontFamily: 'robotoMedium', fontSize: 16, marginTop: 24}}>Ooops, we couldn’t find what you’re looking for.</Text>
              </View> : null}
              ListFooterComponent={
                this.props.loading.SEARCH_BY_GENRE && this.props.searchResultsByGenre.length >= GENERAL_API_LIMIT ?
                    <ActivityIndicator size="small" color={Colors.tintColor} style={{marginTop: 10}}/> :
                    null}
              onEndReached={() => {
                !this.props.loading.SEARCH_BY_GENRE && this.props.searchResultsByGenre.length >= GENERAL_API_LIMIT ?
                    this.props.getSearchByGenreResults(genre, this.props.searchResultsByGenre.length) :
                    null;
              }}
              initialNumToRender={8}
              onEndReachedThreshold={1.5}
          />
        </View>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <Track track={item} origin="genre"/>
  );

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 0,
  },
});

export default connectAlert(connect(mapStateToProps, {getSearchByGenreResults})(GenreScreen));
