// app/components/ProductAnalysis.js
// This component displays the price generated by our
// algorithms for the user to view.

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, KeyboardAvoidingView } from 'react-native';
import { Button, FormLabel, FormInput, Card } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import axios from 'axios';

import { dbUrl, RootNavigator } from '../../App';
import { fetchListings } from '../store';

class ProductAnalysis extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listing: {},
      selectedPrice: 0
    };
  }

  componentDidMount() {
    const listingId = Number(this.props.navigation.state.params.id);

    // Fetch listing associated with the listing ID param
    axios.get(dbUrl + `/api/listings/${listingId}`)
      .then(res => res.data)
      .then(listing => this.setState({
        listing,
        selectedPrice: listing.valuations[listing.valuations.length - 1].metaPrice
      }))
      .catch(error => console.log('Error:', error));
  }

  render() {
    const valuations = this.state.listing.valuations;

    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior='padding' >
        <Card title={`Pricing analysis for ${this.state.listing && this.state.listing.name}`} >
          <Text>{'\n'}Prioracle has made a decision - a fair price for your product to sell at is ${`${valuations && valuations[valuations.length - 1].metaPrice}`}. You may modify the price below if you wish.{'\n'}</Text>
          <FormLabel labelStyle={styles.formLabel}>Suggested Price</FormLabel>
          <FormInput
            inputStyle={styles.inputText}
            textAlign={'center'}
            editable={true}
            value={this.state.selectedPrice.toString()}
            onChangeText={text => this.setState({selectedPrice: Number(text)})} />
        </Card>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#e1e8e6'
    },
    formLabel: {
      color: 'red'
    },
    inputContainer: {
      justifyContent: 'center'
    },
    inputText: {
      color: 'black'
    }
});

const mapStateToProps = (state) => {
  return {
    listings: state.listings.sort((a, b) => b.id - a.id)
  };
}

export default connect(mapStateToProps)(ProductAnalysis);
