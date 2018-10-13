import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import TabBarIcon from '../components/TabBarIcon';
import {connect} from 'react-redux';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <FlatList
                data={this.props.releases}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
            />
          </ScrollView>
        </View>
    );
  }

  _keyExtractor = (item, index) => item.trackURL;

  _renderItem = ({item}) => (
      <View style={styles.trackContainer}>
        <View style={styles.releaseTrackContainer}>
          <Text>{item.artistName}</Text>
        </View>

        <View style={styles.playButtonContainer}>
          <TouchableOpacity>
            <TabBarIcon
                name={Platform.OS === 'ios' ? `ios-play${true ? '' : '-outline'}` : 'md-play'}
            />
          </TouchableOpacity>
        </View>
      </View>
  );
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  trackContainer: {
    flexDirection: 'row',
  },
  releaseTrackContainer: {
    padding: 10,
    flex: 0.9,
  },
  playButtonContainer: {
    padding: 0,
    margin: 0,
    flex: 0.1,
  },
});

export default connect(mapStateToProps, null)(HomeScreen);
