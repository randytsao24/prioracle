// app.components/Home.js
// Landing view for our app!
// NOTE: Home view is currently just a login screen, could add in 
// additional views for introducing what our app does.

import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View, KeyboardAvoidingView } from 'react-native';
import { Button, FormLabel, FormInput } from 'react-native-elements';
import { StackNavigator } from 'react-navigation';
import * as firebase from "firebase";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
    };

    this.handleUsernameInputChange = this.handleUsernameInputChange.bind(this);
    this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
    this.handleLoginButtonPress = this.handleLoginButtonPress.bind(this);
    this.handleSignupButtonPress = this.handleSignupButtonPress.bind(this);
  }

  componentDidMount() {
    // TEMP: Testing out Firebase for our backend needs
    var config = {
      apiKey: "AIzaSyCTQl0kvUuW-Q7VQgdISik_6I-72foW620",
      authDomain: "prioracle-ad317.firebaseapp.com",
      databaseURL: "https://prioracle-ad317.firebaseio.com",
      projectId: "prioracle-ad317",
      storageBucket: "prioracle-ad317.appspot.com",
      messagingSenderId: "910431056594"
    };

    firebase.initializeApp(config);
  }

  async login(email, pass) {
    try {
        await firebase.auth()
            .signInWithEmailAndPassword(email, pass);

        console.log(email, 'is now logging in...');

        this.props.navigation.navigate('ListingForm');

    } catch (error) {
        console.log(error.toString())
    }
  }

  async signup(email, pass) {
    try {
        await firebase.auth()
          .createUserWithEmailAndPassword(email, pass);

        console.log("Creating a new account for ", email);

        this.props.navigation.navigate('ListingForm');

    } catch (error) {
        console.log(error.toString())
    }
  }

  // Updates local component state with contents of username input field
  handleUsernameInputChange(text) {
    this.setState({ username: text });
  }

  // Updates local component state with contents of password input field
  handlePasswordInputChange(text) {
    this.setState({ password: text });
  }

  // TODO: Process credentials here
  handleLoginButtonPress() {
    this.login(this.state.username, this.state.password);
  }

  handleSignupButtonPress() {
    this.signup(this.state.username, this.state.password);
  }

  render() {
    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior='padding' >
        <Text style={styles.titleText}>π r i o r a c l e{'\n\n\n'}</Text>
        <FormLabel labelStyle={styles.inputLabel}>Username</FormLabel>
        <FormInput
          inputStyle={styles.inputText}
          textAlign={'center'}
          onChangeText={text => this.handleUsernameInputChange(text)} />
        <FormLabel labelStyle={styles.inputLabel}>Password</FormLabel>
        <FormInput
          inputStyle={styles.inputText}
          textAlign={'center'}          
          onChangeText={text => this.handlePasswordInputChange(text)}
          secureTextEntry={true} />

        {/* TODO: Find better way to space these components out */}
        <Text>{'\n'}</Text>
        <Button
          title='Log In'
          icon={{ name: 'hot-tub' }}
          onPress={() => this.handleLoginButtonPress()} />
        <Text>{'\n'}</Text>
        <Button
          title='Sign Up'
          icon={{ name: 'add' }}
          onPress={() => this.handleSignupButtonPress()} />
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d14f4f'
  },
  titleText: {
    fontSize: 35,
    color: 'white',
    alignItems: 'center'
  },
  inputLabel: {
    color: 'white'
  },
  inputText: {
    color: 'white'
  }
});

export default Login;