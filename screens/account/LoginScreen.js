import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity, Platform, Dimensions, ScrollView} from 'react-native';
import Colors from '../../constants/Colors';
import {Icon} from 'expo';
import {getStatusBarHeight} from 'react-native-iphone-x-helper/index';
import {Input, Button} from 'react-native-elements';
import {login} from '../../actions';
import {connect} from 'react-redux';
import SocialLogin from '../../components/SocialLogin';
import {isValidEmail} from '../../tools/util';

var {width} = Dimensions.get('window');

class LoginScreen extends React.Component {
  state = {
    result: null,
    showPassword: false,
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
  };

  render() {
    return (
        <ScrollView style={styles.container}>
          <View style={{paddingHorizontal: 16, paddingTop: 8, width: width}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{justifyContent: 'center'}}>
                <Icon.Ionicons
                    name={Platform.OS === 'ios' ? `md-arrow-back` : 'md-arrow-back'}
                    size={20}
                    color={Colors.fontColor}
                />
              </TouchableOpacity>
            </View>

          </View>
          <View style={{justifyContent: 'center', alignItems: 'center', paddingHorizontal: 48}}>
            <Image resizeMode={'contain'} style={{width: 127.36, height: 32.13, padding: 0}} source={require('../../assets/images/logo.png')}/>
            <Text style={{color: Colors.tintColor, fontFamily: 'robotoBold', fontSize: 14, marginTop: 16}}>LOGIN</Text>
            <View style={{flexDirection: 'row', marginTop: 16}}>
              <Text style={{color: Colors.fontColor, fontSize: 12}}>New here? </Text>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Signup')}>
                <Text style={{color: Colors.tintColor, fontSize: 12}}>Sign up</Text>
              </TouchableOpacity>
            </View>

            <Text style={{color: Colors.fontColor, fontSize: 12, marginBottom: 4, marginTop: 16, width: '100%', textAlign: 'left'}}>Email address</Text>
            <Input
                placeholder='your email'
                containerStyle={{width: '100%'}}
                inputStyle={{color: Colors.fontColor, fontSize: 12}}
                placeholderTextColor={Colors.disabled}
                inputContainerStyle={{backgroundColor: Colors.tabBar, borderBottomWidth: 0}}
                leftIcon={{type: 'ionicons', name: 'mail', color: Colors.fontColor}}
                leftIconContainerStyle={{marginLeft: 8}}
                onChangeText={(email) => this.setState({email})}
                value={this.state.email}
                errorMessage={this.state.emailError}
                errorStyle={{color: Colors.errorText, fontSize: 12, fontFamily: 'robotoRegular'}}
                autoCapitalize={'none'}
                shake={true}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8}}>
              <Text style={{color: Colors.fontColor, fontSize: 12, marginBottom: 4, textAlign: 'left'}}>Password</Text>
              <TouchableOpacity
                  style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4}}
                  onPress={() => this.setState({showPassword: !this.state.showPassword})}>
                <Icon.Ionicons
                    name={'md-eye'}
                    size={14}
                    color={Colors.tintColor}
                    style={{marginRight: 5}}
                />
                <Text style={{color: Colors.tintColor, fontSize: 10}}>{this.state.showPassword ? 'Hide' : 'Show'}</Text>
              </TouchableOpacity>
            </View>
            <Input
                placeholder='your password'
                secureTextEntry={!this.state.showPassword}
                containerStyle={{width: '100%'}}
                inputStyle={{color: Colors.fontColor, fontSize: 12}}
                placeholderTextColor={Colors.disabled}
                inputContainerStyle={{backgroundColor: Colors.tabBar, borderBottomWidth: 0}}
                leftIcon={{type: 'ionicons', name: 'lock', color: Colors.fontColor}}
                leftIconContainerStyle={{marginLeft: 8}}
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}
                errorMessage={this.state.passwordError}
                errorStyle={{color: Colors.errorText, fontSize: 12, fontFamily: 'robotoRegular'}}
                autoCapitalize={'none'}
                shake={true}
            />

            <Button
                title="LOGIN"
                titleStyle={{color: 'black', fontFamily: 'robotoBold', fontSize: 14}}
                containerStyle={{backgroundColor: Colors.tintColor, width: '100%', marginTop: 24}}
                buttonStyle={{backgroundColor: Colors.tintColor, height: 40}}
                onPress={()=>this.login()}
            />

            <SocialLogin />

          </View>
        </ScrollView>
    );
  }

  login(){
    this.setState({emailError: "", passwordError: ""});

    if(!isValidEmail(this.state.email)){
      this.setState({emailError: "Please enter a valid email address"});
      return;
    }

    if(this.state.password.length == 0){
      this.setState({passwordError: "Please enter a password"});
      return;
    }

    this.props.login(this.state.email.toLowerCase(), this.state.password);

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

export default connect(mapStateToProps, {login})(LoginScreen);