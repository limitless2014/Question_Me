import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {f} from '../firebaseConfig/config';
import {FlatList} from'react-native';
import {Button, Icon,} from 'native-base'

export default class Questions extends Component {

    state={
        refresh:false,
        data:null,
    }






    componentWillMount(){
        let uid=f.auth().currentUser.uid;
        f.database().ref(`Questions/${uid}`).once('value', snapshot=> {
          const exists=(snapshot.val() !=null);
          if(exists){
            
            const Questions = snapshot.val();
            let newData=[];
            
            Object.entries(Questions).forEach(([key, val])=> {
              newData.push({val,key});
            });
            console.log(newData,newData);
            this.setState({data:newData});
            // console.log('databse',this.state.data);
          } 
        }).catch((err)=>console.log(err));
      }



      loadNew=()=>{
        this.setState({refresh:true,data:null});
           this.componentWillMount();
           this.setState({refresh:false});
       }

       like=(key,likes)=>{
        let uid=f.auth().currentUser.uid;
        let updatedlikes=likes+1;
        f.database().ref(`Questions/${uid}/${key}/`).update({likes:updatedlikes});
       }

       dislike=(key,dislikes)=>{
        let uid=f.auth().currentUser.uid;
        let updateddislikes=dislikes+1;
        f.database().ref(`Questions/${uid}/${key}/`).update({dislikes:updateddislikes});
       }



    render() {
        return (
            
                <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.data}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index}) => (
                    <View key={index} style={{flex:1,flexDirection:'column',justifyContent:'flex-end',borderWidth:1,margin:5,height:150}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold',margin:5}}>Author : {item.val.author}</Text>
                      <Text style={{margin:5}}>{new Date(item.val.date).toLocaleDateString("en-US") }</Text>
                      <Text style={{margin:5}}>{new Date(item.val.date).toLocaleTimeString("en-US") }</Text>
                      </View>
                        <Text style={{margin:5}}>{item.val.title}</Text>
                        <Text style={{margin:5}}>{item.val.comments}</Text>
                        <View style={{flexDirection:'row'}}>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.like(item.key,item.val.likes)}>
                        <Text>{item.val.likes}</Text>
                          <Icon type="AntDesign" name="like2" style={{color:'green'}} />
                        </Button>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.dislike(item.key,item.val.dislikes)} >
                        <Text>{item.val.dislikes}</Text>
                          <Icon type="AntDesign" name="dislike2" style={{color:'red'}} />
                        </Button>
                     
                        </View>
                    </View>
                    )}
                    />
           
        )
    }
}
