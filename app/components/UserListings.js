// app.components/UserListings.js
// This view displays a user's listings.

import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import axios from 'axios';

import { dbUrl } from '../../App';

class UserListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userListings: []
    };
  }

  componentDidMount() {
    // Fetch listings associated with logged-in user
    axios.get(dbUrl + `/api/users/${this.props.user.id}/listings`)
      .then(res => res.data)
      .then(listings => this.setState({ userListings: listings }))
      .catch(error => console.log(error));
  }

  render() {

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card title={`Listings for ${this.props.user && this.props.user.fullName}`}>
          {
            this.state.userListings.map(listing => (
              <Card key={'card' + listing.id}>
                <Text
                  key={'text' + listing.id}
                  onPress={() => this.props.navigation.navigate('Analysis', { id: listing.id })} >
                  {listing.name}{'\n'}
                </Text>
                <Button
                  key={'button' + listing.id}
                  onPress={() => this.props.navigation.navigate('Listing', { id: listing.id })}/>
              </Card>

            ))
          }
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
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps)(UserListing);
