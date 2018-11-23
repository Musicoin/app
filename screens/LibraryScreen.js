import React from 'react';
import {View, Text, StyleSheet, StatusBar, Platform} from 'react-native';
import Colors from '../constants/Colors';

class LibraryScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={{color: 'white'}}>
            [Library screen]
          </Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LibraryScreen;