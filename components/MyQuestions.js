import React, { Component } from 'react'
import { Text, View,FlatList,TouchableHighlight } from 'react-native'
import {f} from '../firebaseConfig/config';
import {Button, Icon,} from 'native-base'

export default class MyQuestions extends Component {

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
                newData.push({val});
              })
              
       
            console.log(newData);
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
                 
                 <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.data}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index}) => (
                  <TouchableHighlight underlayColor={'red'}   key={index}  onPress={()=>console.log('item pressed') }>
                    <View 
                     style={{flex:1,flexDirection:'column',justifyContent:'flex-end',borderWidth:1,borderTopRightRadius:10
                     ,borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:'#81D4FA',margin:5,height:150}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold',margin:5}}>Author : {item.val.author}</Text>
                      <Text style={{margin:5}}>{this.timeConvertor(item.val.date)}</Text>
                       
                      </View>
                        <Text style={{margin:5}}>{item.val.title}</Text>
                        <Text style={{margin:5}}>{item.val.comments}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} >
                        <Text>{this.state.data[index].val.likes}</Text>
                          <Icon type="AntDesign" name="like2" style={{color:'green'}} />
                        </Button>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}}  >
                        <Text>{this.state.data[index].val.dislikes}</Text>
                          <Icon type="AntDesign" name="dislike2" style={{color:'red'}} />
                        </Button>
                        
                        
                        </View>
                    </View>
                    </TouchableHighlight>
                    )}
                    /> 
            </View>
        )
    }
}
