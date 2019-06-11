import React, { Component } from 'react'
import { Text, View,TextInput } from 'react-native'
import {Textarea,Button,Form,Picker} from 'native-base';
import {f} from '../firebaseConfig/config';
export default class AddQuestion extends Component {

    state={
        title:'',
        subject:'',
        selected: "computer and Technology",
        category:''
    }


    createQuestion=(title,subject)=>{
        if(title !='' && subject !='')
        {
         let uid=f.auth().currentUser.uid;
         f.database().ref(`/Questions/${uid}`)
         .push({title:title,comments:subject,date: new Date().getTime(),category:this.state.selected}).then((data)=>{
           //success callback
           console.log('data ' , data)
           }).catch((error)=>{
           //error callback
           console.log('error ' , error)
          })
        }
        else {
          console.log('Question should not be empty');
        }
       
       }

       onValueChange(value) {
        this.setState({
          selected: value
        });
      }


    render() {
        return (
            <View style={{flex:1}}>
                <TextInput style={{margin:5}} onChangeText={(txt)=>this.setState({title:txt})} placeholder="Question title"/>
                <Form>
                    <Picker
                    note
                    mode="dropdown"
                    style={{ width: '100%' }}
                    selectedValue={this.state.selected}
                    onValueChange={this.onValueChange.bind(this)}
                    >
                    <Picker.Item label="computer and Technology" value="computer and Technology" />
                    <Picker.Item label="Biology" value="Biology" />
                    <Picker.Item label="Music" value="Music" />
                    <Picker.Item label="Movie and Cinema" value="Movie and Cinema" />
                    <Picker.Item label="Sport" value="Sport" />
                    </Picker>
                </Form>
                <Textarea style={{margin:5}} rowSpan={5} onChangeText={(txt)=>this.setState({comments:txt})} placeholder="Comments"/>
                <Button style={{alignSelf:'center',width:'20%',justifyContent:'center'}} onPress={()=>this.createQuestion(this.state.title,this.state.comments)}>
                <Text style={{textAlign:'center'}}>Post</Text>
                </Button>
            </View>
        )
    }
}
