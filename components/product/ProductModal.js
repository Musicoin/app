import React from 'react';
import {View, Text, StyleSheet, Image, Platform, FlatList, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import Colors from '../../constants/Colors';
import {addAlert, validateAppleIAPJSON, validateGoogleIAPJSON} from '../../actions';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
  ios: [
    'coin_100',
    'coin_600',
    'coin_2500',
  ],
  android: [
    'coin_100',
    'coin_600',
    'coin_2500',
  ],
});

class ProductModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {products: []};
  }

  async componentDidMount() {
    try {
      const products = await RNIap.getProducts(itemSkus);
      products.sort(this.compare);
      this.setState({products});
      console.log(products);
    } catch (err) {
      console.log(err); // standardized err.code and err.message available
    }
  }

  componentWillUnmount() {
    RNIap.endConnection();
  }

  compare(a, b) {
    const productA = parseFloat(a.price);
    const productB = parseFloat(b.price);

    let comparison = 0;
    if (productA > productB) {
      comparison = 1;
    } else if (productA < productB) {
      comparison = -1;
    }
    return comparison;
  }

  render() {
    return (
        <Modal isVisible={this.props.visible} onBackdropPress={() => this.props.toggleAction()} onBackButtonPress={() => this.props.toggleAction()}>
          <View style={{backgroundColor: Colors.backgroundColor}}>
            <View style={{marginVertical: 16, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{textAlign: 'center'}}>BUY MUSICOIN</Text>
            </View>
          </View>
          <View style={styles.contentContainer}>
            {this.state.products.length > 0 ?
                <FlatList
                    data={this.state.products}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    style={{}} contentContainerStyle={{}}
                />
                :
                <Text style={{marginVertical: 16}}>No products available</Text>
            }
          </View>
        </Modal>
    );
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 8, paddingVertical: 8, backgroundColor: '#212428'}} onPress={() => this.buyProduct(item)}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Image resizeMode={'contain'} style={styles.image} source={require('../../assets/images/icon.png')}/>
          <View style={styles.productContainer}>
            <Text numberOfLines={1} style={styles.product}>{item.title.replace(' (Musicoin - Music For All)', '').replace('$MUSIC', '')}
              <Text style={{color: Colors.tintColor}}>$MUSIC</Text>
            </Text>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.localizedPrice}</Text>
          </View>
        </View>
      </TouchableOpacity>
  );

  async buyProduct(product) {
    if (this.props.profile.profileAddress) {
      try {
        // Will return a purchase object with a receipt which can be used to validate on your server.
        const purchase = await RNIap.buyProduct(product.productId);
        console.log(purchase);
        this.setState({
          receipt: purchase, // save the receipt if you need it, whether locally, or to your server.
        });
        await this.consumePurchases();

      } catch (err) {
        // standardized err.code and err.message available
        console.log(err.code, err.message);
        this.props.addAlert('error', '', 'Failed to buy product');
        const subscription = RNIap.addAdditionalSuccessPurchaseListenerIOS(async (purchase) => {
          this.setState({receipt: purchase}, async () => await this.consumePurchases());
          subscription.remove();
        });
      }
    } else {
      this.props.addAlert('error', '', 'No wallet address available');
    }
  }

  async consumePurchases() {
    this.props.toggleAction();
    try {
      // call api to add the coins
      let validation;

      if (Platform.OS === 'ios') {
        validation = await validateAppleIAPJSON(this.props.auth.email, this.props.auth.accessToken, this.state.receipt.transactionReceipt);
      }

      if (Platform.OS === 'android') {
        //ToDo: check verify Play store purchases
        validation = await validateGoogleIAPJSON(this.props.auth.email, this.props.auth.accessToken, {receipt: this.state.receipt.dataAndroid, signature: this.state.receipt.signatureAndroid});
        // console.log(validation);
        // validation = {tx: "remove this"};
      }
      console.log('validation:');
      console.log(validation);

      // consume products
      const purchases = await RNIap.getAvailablePurchases();
      console.log(purchases);
      purchases.forEach(async purchase => {
        console.log(purchase);
        await RNIap.consumePurchase(purchase.purchaseToken);
      });

      if (validation.tx) {
        this.props.addAlert('success', 'Thank you for your purchase!', 'Your coins will appear in your wallet soon');
      } else {
        this.props.addAlert('error', '', validation.error ? validation.error : 'Something went wrong');
      }
    } catch (err) {
      console.log(err); // standardized err.code and err.message available
      this.props.addAlert('error', '', err.message);
    }
  };

}

function mapStateToProps(state) {
  return state;
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: '#2E343A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  image: {
    marginHorizontal: 8,
    padding: 0,
    height: 40,
    width: 40,
    borderRadius: 3,
  },
  productContainer: {
    justifyContent: 'center',
  },
  product: {
    textAlign: 'left',
    marginHorizontal: 8,
  },
  priceContainer: {
    backgroundColor: Colors.tintColor,
    borderRadius: 2,
    height: 24,
    paddingHorizontal: 8,
    marginHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 64,
  },
  price: {
    color: Colors.backgroundColor,
    fontFamily: 'robotoBold',
    textAlign: 'center',
    alignSelf: 'flex-end',
  },
});

export default connect(mapStateToProps, {addAlert})(ProductModal);
