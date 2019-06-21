import React, { Component } from 'react'
import {FlatList,Text,View} from'react-native';

import {Button, Icon,Header,Left,Title,Body,Right} from 'native-base'
import {f} from '../firebaseConfig/config';
import { TextInput } from 'react-native-gesture-handler';

export default class DetailsPage extends Component {
   



    state={
       answers:this.props.answers,
       refresh:false,
       answer:'',
       index:this.props.index
    }


    static navigationOptions = {
      header: null
  }

    send=(item)=>{
        console.log('item',item);  
        if(this.state.answer !='')
        {
         let email=f.auth().currentUser.email;
         f.database().ref(`Questions/${item.rootkey}/${item.key}/answers`).push({answer:this.state.answer,author:email,time:new Date().getTime()});
         let answersArray=[];
         f.database().ref(`Questions/${item.rootkey}/${item.key}/answers`).once('value', snapshot=> {
            const exists=(snapshot.val() !=null);
            let answers=snapshot.val();
            if(exists){ 
              Object.entries(answers).forEach(([key, val])=> {
                answersArray.push(val);
              })
              this.setState({answers:answersArray});
            }
         })
           
        }
        else{
          console.log('Error : answer cant be empty');
        }
         
        }

        

        like=(key,rootkey,index)=>{
            let updatedlikes=this.state.data[index].val.likes+1;
            let newData=[...this.state.data];
            newData[index].val.likes=updatedlikes;
            this.setState({data:newData});
            f.database().ref(`Questions/${rootkey}/${key}/`).update({likes:updatedlikes});
           }
    
           dislike=(key,rootkey,index)=>{
            let updateddislikes=this.state.data[index].val.dislikes+1;
            let newData=[...this.state.data];
            newData[index].val.dislikes=updateddislikes;
            this.setState({data:newData});
            f.database().ref(`Questions/${rootkey}/${key}/`).update({dislikes:updateddislikes});
           }


           refresh=()=>{
            this.setState({refresh:true});
            let answersArray=[];
            f.database().ref(`Questions/${this.props.item.rootkey}/${this.props.item.key}/answers`).once('value', snapshot=> {
            const exists=(snapshot.val() !=null);
            let answers=snapshot.val();
            if(exists){ 
              Object.entries(answers).forEach(([key, val])=> {
                answersArray.push(val);
              })
              this.setState({answers:answersArray});
            }
         })
    
            this.setState({refresh:false});
           }

           pluralCheck=(s)=>{
            if(s==1){
              return ' ago';
            }
            else{
              return 's ago';
            }
           }
    
           timeConvertor=(timeStamp)=>
           {
            var a=new Date(timeStamp);
            var seconds=Math.floor((new Date() - a)/1000);
            var interval=Math.floor(seconds/31536000);
            if(interval >1) 
            {
              return interval+' year'+this.pluralCheck(interval);
            }
            interval=Math.floor(seconds/2592000);
            if(interval >1){
               return interval+' month'+this.pluralCheck(interval);
              }
            interval=Math.floor(seconds/86400);
            if(interval >1) {
              return interval+' day'+this.pluralCheck(interval);
            }
            interval=Math.floor(seconds/3600);
            if(interval >1) 
            {
              return interval+' hour'+this.pluralCheck(interval);
            }
            interval=Math.floor(seconds/60);
            if(interval >1) {
              return interval+' minute'+this.pluralCheck(interval);
            }
            return Math.floor(seconds)+' second'+this.pluralCheck(seconds);
           }


    render() {
        return (
            <View style={{flex:1}}>
            <Header>
             <Left>
              <Button transparent >
              <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Answers</Title>
            </Body>
            <Right />
            </Header>
          <View  style={{flexDirection:'column',borderWidth:1,borderTopRightRadius:10
                     ,borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:'#81D4FA',margin:5,height:150}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold',margin:5}}>Author : {this.props.item.val.author}</Text>
                      <Text style={{margin:5}}>{this.timeConvertor(this.props.item.val.date)}</Text>
                      </View>
                        <Text style={{margin:5}}>{this.props.item.val.title}</Text>
                        <Text style={{margin:5}}>{this.props.item.val.comments}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.like(item.key,item.rootkey,this.state.index)}>
                        <Text>{this.props.data[this.state.index].val.likes}</Text>
                          <Icon type="AntDesign" name="like2" style={{color:'green'}} />
                        </Button>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.dislike(item.key,item.rootkey,this.state.index)} >
                        <Text>{this.props.data[this.state.index].val.dislikes}</Text>
                          <Icon type="AntDesign" name="dislike2" style={{color:'red'}} />
                        </Button>
                        </View>
                        
                    </View>
                   
                   {this.state.answers != [] ? 
                        <FlatList
                        refreshing={this.state.refresh}
                        onRefresh={this.refresh}
                        style={{marginBottom:60}}
                        data={this.state.answers}
                        keyExtractor={(item,index)=>index.toString()}
                        renderItem={({item,index}) => (
                          <View  style={{flexDirection:'column',borderWidth:1,borderTopLeftRadius:10
                          ,borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:'red',margin:5,height:150}}>
                             <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                             <Text style={{fontWeight:'bold',margin:5}}>Author : {item.author}  </Text>
                             <Text style={{margin:5}}>{this.timeConvertor(item.time)}</Text>
                          </View>
                          <Text style={{margin:5}}>{item.answer}</Text>
                         </View>              
                          )}
                        />  : null }  
                     

                    
                    <View style={{position:'absolute',bottom:0,width:'100%',height:60,justifyContent:'center',justifyContent:'center'}}>
                      <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <TextInput onChangeText={(txt)=>this.setState({answer:txt})} 
                        style={{borderWidth:1,width:'80%'}} placeholder="Type Your Answer Here"/>
                       <Button onPress={()=>this.send(this.props.item)} rounded><Icon type="MaterialIcons" name="send"/></Button>
                       </View>
                    </View>
                    </View>     
        )
    }
}
