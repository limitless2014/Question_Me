import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {Thumbnail, Button} from 'native-base'
export default class Profile extends Component {
    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flexDirection:'row',alignItems:'flex-start',borderBottomWidth:1}}>
                <Thumbnail style={{margin:10}}  source={require('../assets/user.png')}/>
                <Button transparent><Text style={{color:'red'}}>Logout</Text></Button>
                </View>
            </View>
        )
    }
}
