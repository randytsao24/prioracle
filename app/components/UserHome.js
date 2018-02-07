// app.components/UserHome.js
// This view displays a user's home page after they have logged in.

import React, { Component } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Button, Card } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { fetchUserListings } from '../store/index';

class UserHome extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Fetch all listings in our top-level component
    this.props.getListings(this.props.user.id);
  }

  render() {

    const hours = new Date().getHours();
    const greeting = hours < 12? 'Good morning' : 
      hours < 17 ? 'Good afternoon' : 'Good evening';

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card containerStyle={{alignItems: 'stretch'}} titleStyle={{ color: 'red' }} title={`Information for ${this.props.user &&this.props.user.fullName}`}>
          <Text>{'\n'}{greeting}, {`${this.props.user.firstName}`}. What would you like to do today?{'\n'}</Text>
          <Button
            buttonStyle={styles.optionButton}
            textStyle={styles.optionText}
            icon={{ name: 'add-circle', color: 'black', size: 24 }}
            title="Add a new listing"
            onPress={() => this.props.navigation.navigate('ListingForm')} 
          />
          <Button 
            buttonStyle={styles.optionButton}
            textStyle={styles.optionText}
            icon={{ name: 'photo-album', color: 'black', size: 24 }}
            title="View my listings" 
            onPress={() => this.props.navigation.navigate('UserListings')} 
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
    backgroundColor: '#e1e8e6',
    alignItems: 'stretch'
  },
  optionButton: {
    backgroundColor: 'white'
  },
  optionText: {
    color: 'black'
  }
});

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    getListings(userId) {
      dispatch(fetchUserListings(userId));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserHome);