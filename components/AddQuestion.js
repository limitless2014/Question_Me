import React, { Component } from 'react'
import { Text, View,TextInput,Button,ToastAndroid,ImageBackground } from 'react-native'
import {Textarea,Form,Picker,Content,Header } from 'native-base';
import {f} from '../firebaseConfig/config';
var soundPlayer=require('react-native-sound');
var succesSong=null;

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
        disabled:false
    }

    componentDidMount(){
      succesSong=new soundPlayer('success.mp3',soundPlayer.MAIN_BUNDLE,(error)=>{
        if(error){
          ToastAndroid.show('error when init soundplayer',ToastAndroid.SHORT);
        }
      })
     
    }



    createQuestion=(title,subject)=>{
      
        
        if(title !='' && subject !='')
        {
          this.setState({disabled:true});
         let uid=f.auth().currentUser.uid;
         let email=f.auth().currentUser.email;
         f.database().ref(`/Questions/${uid}`)
         .push({title:title,likes:0,dislikes:0,comments:subject,category:this.state.selected,author:email
          ,date: new Date().getTime(),likeColor:'green',users:[''],dislikeColor:'red',disabled:false})
         .then((data)=>{
           //success callback
           console.log('data ' , data);
           this.setState({disabled:false});
           succesSong.play(); 
           }).catch((error)=>{
           //error callback
           this.setState({disabled:false});
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
                <Button disabled={this.state.disabled} title="Add" style={{alignSelf:'center',justifyContent:'center'}}
                 onPress={()=>this.createQuestion(this.state.title,this.state.comments)}/>
                 
                </View>
              
                </Content>
               
            </View>
        )
    }
}
