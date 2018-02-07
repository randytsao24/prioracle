// app.components/UserListings.js
// This view displays a user's listings.

import React, { Component } from 'react';
import { StyleSheet, Text, FlatList, ScrollView, View } from 'react-native';
import { Button, Card, Divider, List, ListItem } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import axios from 'axios';

import { dbUrl } from '../../App';
import { deleteListing } from '../store/index';

// Subcomponent for rendering a single listing
class UserListingItem extends Component {
  constructor(props) {
    super(props);

    this.handleListingClick = this.handleListingClick.bind(this);
    this.handleListingData = this.handleListingData.bind(this);

  }

  handleListingClick() {
    this.props.navigation.navigate('Analysis', { id: this.props.itemId });
  }
  handleListingData() {
    this.props.navigation.navigate('Listing', { id: this.props.itemId });
  }

  render() {
    return (
      <View style={styles.listingItem} >
        <Text
          style={styles.itemText}
          adjustsFontSizeToFit={true} >
          {this.props.title}
        </Text>
        <Button
            containerViewStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            icon={{ name: 'line-graph', type: 'entypo', color: 'green', size: 26}}
            onPress={this.handleListingData} />
        <Button
            containerViewStyle={styles.buttonContainer}
            buttonStyle={styles.buttonStyle}
            icon={{ name: 'delete', color: 'red', size: 26, alignItems: 'right' }}
            onPress={() => this.props.deleteUserListing(Number(this.props.itemId))} />
      </View>
    )
  }
}

// UserListing displays a list of all of the logged-in user's listings
class UserListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userListings: []
    };

    this.renderItem = this.renderItem.bind(this);
    this.deleteUserListing = this.deleteUserListing.bind(this);
  }

  componentDidMount() {
    // Fetch listings associated with logged-in user
    // axios.get(dbUrl + `/api/users/${this.props.user.id}/listings`)
    //   .then(res => res.data)
    //   .then(listings => this.setState({ userListings: listings }))
    //   .catch(error => console.log(error));
  }

  async deleteUserListing(listingId) {
    console.log("listingId:", listingId);
    await axios.delete(dbUrl + '/api/listings/' + listingId);

    this.setState({
      userListings: userListings.filter(listing => listing.id !== Number(listingId))
    });
  }

  renderItem({item}) {
    return (
      <UserListingItem
        key={item.id}
        title={item.name}
        itemId={item.id}
        navigation={this.props.navigation}
        deleteUserListing={this.props.deleteUserListing}
      />
    );
  }

  render() {

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card titleStyle={{ color: 'red' }} title={`Listings for ${this.props.user && this.props.user.fullName}`}>
          <Text>{this.props.listings.length === 0 && 'You don\'t have any listings!'}</Text>
          <FlatList
            data={this.props.listings}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index}
            extraData={this.state}
          />
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#e1e8e6'
  },
  listingItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  itemText: {
    fontSize: 16,
    flex: 4
  },
  buttonContainer: {

    backgroundColor: 'red'
  },
  buttonStyle: {
    backgroundColor: 'white'
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.user,
    listings: state.listings
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteUserListing(listingId) {
      dispatch(deleteListing(listingId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserListing);
