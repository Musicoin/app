import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {View, StatusBar} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import {connect} from 'react-redux';
import {deleteAlert} from '../../actions';

class AlertProvider extends Component {
  static get childContextTypes() {
    return {
      alertWithType: PropTypes.func,
      alert: PropTypes.func,
    };
  }

  static get propTypes() {
    return {
      children: PropTypes.any,
    };
  }

  componentDidUpdate(prev){
    if (this.props.alert) {
      if(this.props.alert){
        let alert = this.props.alert;
        this.dropdown.alertWithType(alert.type, alert.title, alert.message);
        this.props.deleteAlert();
      }
    }

  }

  getChildContext() {
    return {
      alert: (...args) => this.dropdown.alert(...args),
      alertWithType: (...args) => this.dropdown.alertWithType(...args),
    };
  }

  render() {
    return (
        <View style={{flex: 1}}>
          {React.Children.only(this.props.children)}
          <DropdownAlert
              ref={(ref) => {
                this.dropdown = ref;
              }}
              updateStatusBar={false}
              defaultContainer={{
                padding: 8,
                paddingTop: StatusBar.currentHeight,
                flexDirection: 'row',
              }}
              renderImage={()=><View></View>}
          />
        </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps, {deleteAlert})(AlertProvider);