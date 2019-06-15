import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {f} from '../firebaseConfig/config';
import {FlatList,TouchableHighlight} from'react-native';
import {Button, Icon} from 'native-base'

export default class Questions extends Component {


    state={
        refresh:false,
        data:null,
        details:null
    }






    componentWillMount(){
        let uid=f.auth().currentUser.uid;
        f.database().ref(`Questions/`).once('value', snapshot=> {
          const exists=(snapshot.val() !=null);
          if(exists){
            
            const Questions = snapshot.val();
            let newData=[];
            
            Object.entries(Questions).forEach(([rootkey, val])=> {
              Object.entries(val).forEach(([key, val])=> {
                newData.push({val,key,rootkey});
              })
              
            });
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

       like=(key,rootkey,index)=>{
        let uid=f.auth().currentUser.uid;
        let updatedlikes=this.state.data[index].val.likes+1;
        let newData=[...this.state.data];
        newData[index].val.likes=updatedlikes;
        this.setState({data:newData});
        f.database().ref(`Questions/${rootkey}/${key}/`).update({likes:updatedlikes});
       }

       dislike=(key,rootkey,index)=>{
        let uid=f.auth().currentUser.uid;

        let updateddislikes=this.state.data[index].val.dislikes+1;
        let newData=[...this.state.data];
        newData[index].val.dislikes=updateddislikes;
        this.setState({data:newData});

        f.database().ref(`Questions/${rootkey}/${key}/`).update({dislikes:updateddislikes});
       }

       itemPressed=(item,index)=>{
         this.setState({details:
          <View style={{flex:1}}>
          <View
                     style={{flexDirection:'column',borderWidth:1,borderTopRightRadius:10
                     ,borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:'#81D4FA',margin:5,height:150}}
                     
                     >
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold',margin:5}}>Author : {item.val.author}</Text>
                      <Text style={{margin:5}}>{new Date(item.val.date).toLocaleDateString("en-US") }</Text>
                      <Text style={{margin:5}}>{new Date(item.val.date).toLocaleTimeString("en-US") }</Text>
                      </View>
                        <Text style={{margin:5}}>{item.val.title}</Text>
                        <Text style={{margin:5}}>{item.val.comments}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.like(item.key,item.rootkey,index)}>
                        <Text>{this.state.data[index].val.likes}</Text>
                          <Icon type="AntDesign" name="like2" style={{color:'green'}} />
                        </Button>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.dislike(item.key,item.rootkey,index)} >
                        <Text>{this.state.data[index].val.dislikes}</Text>
                          <Icon type="AntDesign" name="dislike2" style={{color:'red'}} />
                        </Button>
                        </View>
                        
                    </View>
                    <View style={{backgroundColor:'red',width:'100%',height:4,marginVertical:5}}/>
                    <Text style={{fontWeight:'bold',margin:5,fontSize:20}}>Answers :</Text>
                    </View>     
        })
       }



    render() {
         if(this.state.details !=null)
         {
           return this.state.details;
         }
        return (
                
                <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.data}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index}) => (
                      <TouchableHighlight underlayColor={'red'}   key={index}  onPress={()=>this.itemPressed(item,index) }>
                    <View
                     style={{flex:1,flexDirection:'column',justifyContent:'flex-end',borderWidth:1,borderTopRightRadius:10
                     ,borderBottomLeftRadius:10,borderBottomRightRadius:10,backgroundColor:'#81D4FA',margin:5,height:150}}
                     
                     >
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold',margin:5}}>Author : {item.val.author}</Text>
                      <Text style={{margin:5}}>{new Date(item.val.date).toLocaleDateString("en-US") }</Text>
                      <Text style={{margin:5}}>{new Date(item.val.date).toLocaleTimeString("en-US") }</Text>
                      </View>
                        <Text style={{margin:5}}>{item.val.title}</Text>
                        <Text style={{margin:5}}>{item.val.comments}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.like(item.key,item.rootkey,index)}>
                        <Text>{this.state.data[index].val.likes}</Text>
                          <Icon type="AntDesign" name="like2" style={{color:'green'}} />
                        </Button>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.dislike(item.key,item.rootkey,index)} >
                        <Text>{this.state.data[index].val.dislikes}</Text>
                          <Icon type="AntDesign" name="dislike2" style={{color:'red'}} />
                        </Button>
                        </View>
                        
                    </View>
                    </TouchableHighlight>
                    )}
                    />
                    
        )
    }
}
