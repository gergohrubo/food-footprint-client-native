import React, { Component } from 'react';
import { View } from 'react-native';
import Camera from './screens/Camera'
import SignUp from './screens/SignUp';
import styles from './App.styles';

export default class ShatApp extends Component {
  render() {
    return (
      <Camera />
    )
  }
}