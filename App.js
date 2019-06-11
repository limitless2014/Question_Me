/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import{createStackNavigator, createAppContainer} from 'react-navigation'
import Login from './components/Login';
import Home from './components/Home';
import {createStore} from 'redux'
import {Provider,connect} from 'react-redux'
import {combineReducers} from 'redux'


// A very simple reducer
reducer=(state={},action)=>{
  switch(action.type)
  {
      case 'SET_RESPONSE' :return {...state,res:action.res};
      default:return  state;
  }
}

// A very simple store
let store = createStore(combineReducers({ res: reducer }));

// Connect the screens to Redux
let LoginContainer = connect(state => ({ res: state.res }))(Login);
let HomeContainer = connect(state => ({ res: state.res }))( Home);


 const MainRoute=createStackNavigator({
  Login:{screen:LoginContainer},Home:{screen:HomeContainer}
},{
  initialRouteName: 'Login',
})
const Navigation=createAppContainer(MainRoute);




export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <Navigation/>
      </Provider>
      
    );
  }
}



