// App.js
// Entry point for Prioracle!

import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Provider } from 'react-redux'
import { StackNavigator } from 'react-navigation';
import Login from './app/components/Login';
import ListingForm from './app/components/ListingForm';
import ProductAnalysis from './app/components/ProductAnalysis';
import { Icon, Header } from 'react-native-elements';
import store, { fetchListings } from  './app/store';
import AppHeader from './app/components/AppHeader';
import UserHome from './app/components/UserHome';
import UserListings from './app/components/UserListings';
import UserSettings from './app/components/UserSettings';
import Signup from './app/components/Signup';
import Intro from './app/components/Intro';

// Use this link to access our backend!

export const dbUrl = 'http://172.16.34.11:8080';
//export const dbUrl = 'http://172.16.21.255:8080';
//export const dbUrl = 'http://172.16.23.11:8080';
//export const dbUrl = 'http://192.168.1.4:8080';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Fetch all listings in our top-level component
    store.dispatch(fetchListings());
  }

  render() {
    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
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
  }
});

export const RootNavigator = StackNavigator({
  Main: {
    screen: Login,
    navigationOptions: {
      header: null
    }
  },
  UserHome: {
    screen: UserHome,
    navigationOptions: ({ navigation }) => ({
      title: 'Home',
      header: <AppHeader navigation={navigation} />
    })
  },
  ListingForm: {
    screen: ListingForm,
    navigationOptions: ({navigation}) => ({
      title: 'Add a New Listing',
      header: <AppHeader navigation={navigation} />
    })
  },
  Analysis: {
    screen: ProductAnalysis,
    path: 'listings/:id',
    navigationOptions: ({ navigation }) => ({
      title: 'Product Analysis',
      header: <AppHeader navigation={navigation} />
    })
  },
  UserListings: {
    path: 'user/:id/listings',
    screen: UserListings,
    navigationOptions: ({ navigation }) => ({
      title: 'Product Analysis',
      header: <AppHeader navigation={navigation} />
    })
  },
  Settings: {
    screen: UserSettings,
    navigationOptions: ({ navigation }) => ({
      title: 'Settings',
      header: <AppHeader navigation={navigation} />
    })
  },
  Signup: {
    screen: Signup,
    navigationOptions: {
      header: null
    }
  },
  Intro: {
    screen: Intro,
    navigationOptions: {
      header: null
    }
  }
});
