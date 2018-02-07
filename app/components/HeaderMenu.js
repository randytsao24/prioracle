// app/components/HeaderOptions.js
// Modal for showing dropdown menu from header

import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, StyleSheet} from 'react-native';
import { Icon } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
import {logout} from '../store';
import { connect } from 'react-redux';

const menuOptions = [
  'Add New Listing',      // ListingForm
  'View Your Listings',   // UserListings
  'Settings',             // UserSettings
  'Logout'
];

class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.handleMenuSelection = this.handleMenuSelection.bind(this);
  }

  handleMenuSelection(index, value) {
    // Navigate to view associated with each option
    if (value === 'Add New Listing')
      this.props.navigation.navigate('ListingForm');
    else if (value === 'View Your Listings')
      this.props.navigation.navigate('UserListings');
    else if (value === 'Settings')
      this.props.navigation.navigate('Settings');
    else if (value === 'Logout') {
      // Handle user logging out
      this.props.logoutUser(this.props.navigation);
    }
  }

  render() {
    return (
      <ModalDropdown 
        options={menuOptions}
        dropdownTextStyle={styles.dropdownText}
        onSelect={this.handleMenuSelection} >
        <Icon name='menu' size={30} />
      </ModalDropdown>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#d14f4f'
  },
  headerContainer: {
    backgroundColor: '#d14f4f',
    padding: 20
  },
  dropdownText: {
    fontSize: 16,
    color: 'red'
  }
});

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser (navigation) {
      dispatch(logout(navigation))
    }
  }
}

export default connect(null, mapDispatchToProps)(HeaderMenu);
