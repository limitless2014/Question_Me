import React, { Component } from 'react'
import { Text, View,TextInput,Button } from 'react-native'
import {Textarea,Form,Picker,Content,Header } from 'native-base';
import {f} from '../firebaseConfig/config';


export default class AddQuestion extends Component {
  constructor(props){
    super(props);
  }

    state={
        title:'',
        subject:'',
        author:'',
        selected: "computer and Technology",
        category:'',
        bold:false
    }


    createQuestion=(title,subject)=>{
        if(title !='' && subject !='')
        {
         let uid=f.auth().currentUser.uid;
         let email=f.auth().currentUser.email;
         f.database().ref(`/Questions/${uid}`)
         .push({title:title,likes:0,dislikes:0,comments:subject,category:this.state.selected,author:email,date: new Date().getTime()})
         .then((data)=>{
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


       bold=()=>{
         this.setState({bold:!this.state.bold});
       }
       onValueChange(value) {
        this.setState({
          selected: value
        });
      }


    render() {
        return (
            <View style={{flex:1}}>
              <Header style={{justifyContent:'center',alignItems:'center'}} >
                    <Text style={{fontWeight:'bold',color:'white',fontSize:20}} >Add New Question</Text>
                </Header>
                <Content padder>

                <TextInput style={{margin:5,borderWidth:1}} onChangeText={(txt)=>this.setState({title:txt})} placeholder="Question title"/>
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
                    <Picker.Item label="History" value="History" />
                    <Picker.Item label="Movie and Cinema" value="Movie and Cinema" />
                    <Picker.Item label="Sport" value="Sport" />
                    </Picker>
                </Form>
                <Textarea style={{margin:5,borderWidth:1}} rowSpan={5} onChangeText={(txt)=>this.setState({comments:txt})} placeholder="Comments"/>
                <View style={{width:'50%',alignSelf:'center',marginTop:10}}>
                <Button title="Post" style={{alignSelf:'center',justifyContent:'center'}}
                 onPress={()=>this.createQuestion(this.state.title,this.state.comments)}/>
                </View>
                </Content>
            </View>
        )
    }
}
