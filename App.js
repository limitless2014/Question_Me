/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import{createAppContainer,createStackNavigator} from 'react-navigation'
import Login from './components/Login'
import Home from './components/Home'
class App extends Component {
  render() {
    return (
      <MainRoute initialRoute="Login"/>
    );
  }
}


const MainRoute=createStackNavigator({
  Login:{screen:Login},Home:{screen:Home}
})

let myapp=createAppContainer(MainRoute);
export default myapp;