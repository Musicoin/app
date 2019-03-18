import React from 'react';
import {View, Text, StyleSheet, Image, Picker, TextInput} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Colors from '../constants/Colors';
import {tipTrack} from '../actions';
import {Input, Button} from 'react-native-elements';

class TippingModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {amount: this.props.settings.tipAmount.toString(), amountError: ''};
  }

  render() {
    return (
        this.props.track?
        <Modal isVisible={this.props.visible} onBackdropPress={() => this.props.toggleAction()} onBackButtonPress={() => this.props.toggleAction()}>
          <View style={{backgroundColor: Colors.backgroundColor}}>
            <View style={{flexDirection: 'row'}}>
              <Image style={{width: 64, height: 64, margin: 16}} source={{uri: this.props.track.trackImg}}/>
              <View style={{marginVertical: 16}}>
                <TextTicker
                    style={{color: Colors.tintColor, fontSize: 16, width: 200}}
                    duration={5000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                >
                  {this.props.track.title}
                </TextTicker>
                <TextTicker
                    style={{color: '#8897A2', fontSize: 12, marginTop: 8, width: 200}}
                    duration={5000}
                    loop
                    bounce
                    repeatSpacer={50}
                    marqueeDelay={1000}
                >
                  {this.props.track.artistName}
                </TextTicker>
              </View>
            </View>
          </View>
          <View style={styles.contentContainer}>
            <Text>
              <Text>Select your tip amount in </Text>
              <Text style={{color: Colors.tintColor}}>$MUSIC</Text>
            </Text>

            <Input
                placeholder='Your tip amount'
                keyboardType={'number-pad'}
                containerStyle={{width: '100%', marginTop: 16}}
                inputStyle={{color: Colors.backgroundColor, fontSize: 14}}
                placeholderTextColor={Colors.disabled}
                inputContainerStyle={{backgroundColor: Colors.fontColor, borderBottomWidth: 0}}
                onChangeText={(amount) => this.setState({amount})}
                value={this.state.amount}
                errorMessage={this.state.amountError}
                errorStyle={{color: Colors.errorText, fontSize: 12, fontFamily: 'robotoRegular'}}
                autoCapitalize={'none'}
                maxLength={10}
                shake={true}
            />

            <Button
                title="TIP"
                titleStyle={{color: 'black', fontFamily: 'robotoBold', fontSize: 14}}
                containerStyle={{backgroundColor: Colors.tintColor, width: '100%', marginTop: 24}}
                buttonStyle={{backgroundColor: Colors.tintColor, height: 40}}
                onPress={() => this.tip()}
            />
          </View>
        </Modal>:null
    );
  }

  tip() {
    this.setState({amountError: ''});
    if (parseInt(this.state.amount) > this.props.profile.balance) {
      this.setState({amountError: 'You don\'t have enough coins to tip this amount'});
      return;
    }

    this.props.tipTrack(this.props.track, parseInt(this.state.amount));
    this.props.toggleAction();
  }
}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#2E343A',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect(mapStateToProps, {tipTrack})(TippingModal);
