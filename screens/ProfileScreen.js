import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Platform} from 'react-native';
import {Icon} from 'expo';
import Colors from '../constants/Colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper/index';
import Layout from '../constants/Layout';
import {connect} from 'react-redux';
import {logout} from '../actions';
import {Button} from 'react-native-elements';
import ProductModal from '../components/product/ProductModal';

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {isProductModalVisible: false};
  }

  render() {
    return (
        <View style={[styles.container, {marginBottom: this.props.currentTrack ? Layout.playerHeight : 0}]}>
          {this.props.auth.loggedIn ?
              <View>
                <View style={{backgroundColor: Colors.tabBar, paddingVertical: 16}}>
                  <Text style={{color: Colors.fontColor, alignSelf: 'center', fontSize: 18}}>Profile</Text>
                </View>
                <View style={{flexDirection: 'row', backgroundColor: '#3C4146', height: 80, alignItems: 'center', paddingHorizontal: 16}}>
                  {this.props.profile.avatar ?
                      <Image style={{width: 40, height: 40, borderRadius: 20, marginRight: 8}} source={{uri: this.props.profile.avatar}}/>
                      :
                      <View style={{width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.backgroundColor, marginRight: 8, alignItems: 'center', justifyContent: 'center'}}>
                        <Icon.Ionicons
                            name={Platform.OS === 'ios' ? 'ios-person' : 'ios-person'}
                            size={20}
                            color={Colors.disabled}
                            style={{}}
                        />
                      </View>
                  }
                  <Text style={{color: Colors.fontColor, fontSize: 14}}>{this.props.profile.username}</Text>
                </View>
                <View style={{marginTop: 24, paddingHorizontal: 16}}>

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}} onPress={() => this.props.navigation.navigate('Wallet')}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Icon.Ionicons
                          name={Platform.OS === 'ios' ? 'md-wallet' : 'md-wallet'}
                          size={20}
                          color={Colors.disabled}
                          style={{marginRight: 16}}
                      />
                      <Text style={{fontSize: 14}}>Wallet</Text>
                    </View>
                    <Text style={{fontSize: 14, color: Colors.tintColor}}>$MUSIC {this.props.profile.balance}</Text>
                  </TouchableOpacity>

                  {/*<TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.navigation.navigate('Invite')}>*/}
                  {/*<Icon.Ionicons*/}
                  {/*name={Platform.OS === 'ios' ? 'ios-gift' : 'ios-gift'}*/}
                  {/*size={20}*/}
                  {/*color={Colors.disabled}*/}
                  {/*style={{marginRight: 16}}*/}
                  {/*/>*/}

                  {/*<Text style={{fontSize: 14}}>Invite friends</Text>*/}
                  {/*</TouchableOpacity>*/}

                  {this.props.profile.profileAddress ?
                      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this._toggleProductModal()}>
                        <Icon.Ionicons
                            name={Platform.OS === 'ios' ? 'md-card' : 'md-card'}
                            size={20}
                            color={Colors.disabled}
                            style={{marginRight: 16}}
                        />
                        <Text style={{fontSize: 14}}>Buy $MUSIC</Text>
                      </TouchableOpacity> : null}

                  <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginTop: 16}} onPress={() => this.props.logout()}>
                    <Icon.Ionicons
                        name={Platform.OS === 'ios' ? 'md-log-out' : 'md-log-out'}
                        size={20}
                        color={Colors.disabled}
                        style={{marginRight: 16}}
                    />

                    <Text style={{fontSize: 14}}>Logout</Text>
                  </TouchableOpacity>

                </View>
                <ProductModal visible={this.state.isProductModalVisible} toggleAction={() => this._toggleProductModal()}/>
              </View>
              :
              <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={{alignItems: 'stretch', justifyContent: 'center', paddingHorizontal: 16, marginTop: 24}}>

                  <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Image resizeMode={'contain'} style={{padding: 0, height: 200, width: 200}} source={require('../assets/images/guitar.png')}/>
                  </View>
                  <Text style={{color: Colors.tintColor, fontSize: 16, fontFamily: 'robotoBold', textAlign: 'center', marginTop: 24}}>MUSIC FOR ALL</Text>

                  <Text style={{color: Colors.disabled, fontSize: 14, textAlign: 'center', marginTop: 8, marginHorizontal: 16}}>
                    Sign up to discover Musicoin’s full experience, access your $MUSIC wallet, and tip your favorite artists.
                  </Text>

                  <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginHorizontal: 16}}>
                    <Button
                        title="LOGIN"
                        titleStyle={{color: Colors.fontColor, fontFamily: 'robotoBold', fontSize: 14}}
                        containerStyle={{backgroundColor: Colors.disabled, marginTop: 32, marginRight: 8, width: '50%'}}
                        buttonStyle={{backgroundColor: Colors.disabled, height: 40}}
                        onPress={() => this.props.navigation.navigate('Login')}
                    />
                    <Button
                        title="SIGN UP"
                        titleStyle={{color: 'black', fontFamily: 'robotoBold', fontSize: 14}}
                        containerStyle={{backgroundColor: Colors.tintColor, marginTop: 32, marginLeft: 8, width: '50%'}}
                        buttonStyle={{backgroundColor: Colors.tintColor, height: 40}}
                        onPress={() => this.props.navigation.navigate('Signup')}
                    />
                  </View>
                </View>
              </View>
          }
        </View>
    );
  }

  _toggleProductModal() {
    this.setState({isProductModalVisible: !this.state.isProductModalVisible});
  }

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(true),
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
});

export default connect(mapStateToProps, {logout})(ProfileScreen);