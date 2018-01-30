// app/components/ListingForm.js
// View for a user to enter product information and obtain 
// a suggested price.

import React, { Component } from 'react';
import { StyleSheet, Text, KeyboardAvoidingView } from 'react-native';
import { Button, FormLabel, FormInput, Header } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';

import { fetchListings } from '../store';

class ProductAnalysis extends Component {
  constructor(props) {
    super(props);

    // TODO: Set initial price to whatever was suggested by the combined power of our algorithms 
    this.state = {
      listing: {},
      selectedPrice: 0
    };
  }

  componentDidMount() {
    // TEMP: Find listing that was just posted by ID
    // TODO: Search on backend for listing
    const listingId = Number(this.props.navigation.state.params.id);
    const currentListing = this.props.listings.find(listing => listing.id === listingId);

    this.setState({ listing: currentListing });
  }

  render() {
    return this.state.listing && (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior='padding' >
        {/* TODO: Replace with sticky header */}
        <Header
          outerContainerStyles={styles.headerOuterContainer}
          leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{ text: 'Prioracle', style: { color: '#fff', fontSize: 20 } }}
          rightComponent={{ icon: 'home', color: '#fff' }}
          backgroundColor='#d14f4f'
        />
        <Text>{'\n\n'}Information for {`${this.state.listing.name}`}</Text>
        <Text>{'\n\n'}Description: {`${this.state.listing.description}`}</Text>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#b7513c'
    },
    headerOuterContainer: {
      height: 50
    },
    formLabel: {
      color: 'white'
    },
    inputContainer: {
      justifyContent: 'center'
    },
    inputText: {
      color: 'white'
    }
});

const mapStateToProps = (state) => {
  return {
    listings: state.listings.sort((a, b) => b.id - a.id)
  };
}

export default connect(mapStateToProps)(ProductAnalysis);
