import React, { Component } from 'react'
import { Text, View,FlatList, Alert } from 'react-native'
import {f} from '../firebaseConfig/config';
import {Button, Icon,Spinner,Header,Content, Thumbnail} from 'native-base'
import * as Progress from 'react-native-progress';
import { TextInput } from 'react-native-gesture-handler';


export default class MyQuestions extends Component {

    state={
        refresh:false,
        data:null,
        loading:false,
        editing:false,
        
    }




    componentWillMount(){
        let uid=f.auth().currentUser.uid;
        this.setState({loading:true});
        f.database().ref(`Questions/${uid}`).once('value', snapshot=> {
          const exists=(snapshot.val() !=null);
          if(exists){
            const Questions = snapshot.val();
            let newData=[];
              Object.entries(Questions).forEach(([key, val])=> {
                newData.push({val,key:key});
              })
            this.setState({data:newData,loading:false});
          } 
        }).catch((err)=>{console.log(err);this.setState({loading:false})})
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




    calcLikePercentage=(likes,dislikes)=>{
      let likenum=parseInt(likes);
      let dislikenum=parseInt(dislikes);
      if(likenum===0){
        return 0;
      }
      else{
      const sum=likenum+dislikenum;
      let result=likenum/sum;
      result=result.toFixed(2)
      return result;
      }
    }



    calcDislikePercentage=(likes,dislikes)=>{
      let likenum=parseInt(likes);
      let dislikenum=parseInt(dislikes);
      if(dislikenum===0){
        return 0;
      }
      else{
      const sum=likenum+dislikenum;
      let result=dislikenum/sum;
      result=result.toFixed(2)
      return result;
      }
    }

       delete=(item,index)=>{
        Alert.alert(
          'Delete ?',
          'Are You Sure to Delete This Question ?',
          [
            {text: 'Yes', onPress: () => {
            let currentData=[...this.state.data];
             currentData.splice(index, 1);
            this.setState({data:currentData});
            let uid=f.auth().currentUser.uid;
            f.database().ref(`Questions/${uid}/${item.key}/`).remove()
            .catch((error)=>console.log(error));
            }
          },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: true},
        );
       }

       titleChange=(txt,index)=>{
        let currentData=[...this.state.data];
        currentData[index].val.title=txt;
        this.setState({data:currentData});
       }
      commentChange=(txt,index)=>{
        let currentData=[...this.state.data];
        currentData[index].val.comments=txt;
        this.setState({data:currentData});
      }
         
       

       saveChanges=(item,index)=>{
       this.setState({showLoadingButton:true});
        let uid=f.auth().currentUser.uid;
        let title=this.state.data[index].val.title;
        let comments=this.state.data[index].val.comments;
        console.log('comments :',comments,'title : ',title);
        f.database().ref(`Questions/${uid}/${item.key}/`).update({title:title,comments:comments,date:new Date().getTime()})
        .catch((error)=>console.log(error));
        this.setState({editing:false});
       }
   
    render() {
   
    
      if(this.state.loading){
        return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
               <Spinner color='blue' />
               </View>
      }
        return (
            <View style={{flex:1}}>
               <Header style={{justifyContent:'center',alignItems:'center'}} >
                    <Text style={{fontWeight:'bold',color:'white',fontSize:20}} >Profile Page</Text>
                </Header>
                <Content padder>
                 <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                    

                    {this.props.user !==undefined ?<Thumbnail large source={{uri:this.props.user.user.photoURL}}/>  :
                  <Thumbnail large source={{uri:"https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png"}}/>
                    }
                  
                  <View style={{justifyContent:'center'}}>
                 {this.props.user !== undefined ? <Text style={{fontWeight:'bold'}}>{this.props.user.user.displayName}</Text> :
                  <Text style={{fontWeight:'bold'}}>{this.props.res.user.displayName}</Text> }
                  
                 {this.props.user !== undefined ? <Text style={{fontWeight:'bold'}}>{this.props.user.user.email}</Text> :
                  <Text style={{fontWeight:'bold'}}>{this.props.res.user.email}</Text> }
                  </View>
                 </View>
                 <Content padder/>
                 <Button block transparent bordered onPress={()=>{f.auth().signOut();this.props.navigate('Login')}} 
                 ><Text style={{color:'red'}}>LogOut</Text></Button>
                 <Content padder/>
                 
                    <Text style={{textAlign:'center',fontWeight:'bold',paddingBottom:5, borderBottomWidth:1.5}}>Your Questions</Text>
                   
                  <Content padder/>
                  
                 <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.data}
                    keyExtractor={(item,index)=>index.toString()}
                    extraData={{...this.state}}
                    renderItem={({item,index}) => (
                   
                    <View 
                     style={{flex:1,flexDirection:'column',borderWidth:1,borderTopRightRadius:10
                     ,borderBottomLeftRadius:10,borderBottomRightRadius:10,margin:5}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold',margin:5}}>Author : {item.val.author}</Text>
                      <Text style={{margin:5}}>{this.timeConvertor(item.val.date)}</Text>
                       
                      </View>
                      {this.state.editing ?
                      <TextInput onChangeText={(txt)=>this.titleChange(txt,index)} style={{margin:5,color:'blue'}}>{item.val.title}</TextInput>
                      : 
                      <Text style={{margin:5}}>{item.val.title}</Text>
                      }
                      {this.state.editing ?
                      <TextInput onChangeText={(txt)=>this.commentChange(txt,index)} style={{margin:5,color:'blue'}}>{item.val.comments}</TextInput>
                      :
                        <Text style={{margin:5}}>{item.val.comments}</Text>
                      }
                        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                          <Text style={{fontWeight:'bold'}}>Likes</Text>
                        <Progress.Bar style={{margin:10}} progress={this.calcLikePercentage(this.state.data[index].val.likes,this.state.data[index].val.dislikes)}
                        size={50} />
                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                          <Text style={{fontWeight:'bold'}}>DisLikes</Text>
                        <Progress.Bar style={{margin:10}} progress={this.calcDislikePercentage(this.state.data[index].val.likes,this.state.data[index].val.dislikes)}
                        size={50} color="red" />
                        </View>
                        
                        <View style={{flexDirection:'row',justifyContent:'space-around',margin:5}}>
                         <Button transparent onPress={()=>this.delete(this.state.data[index],index)} >
                           <Icon type="MaterialCommunityIcons" name="delete" style={{color:'red'}}/>
                         </Button>
                         {this.state.editing ? 
                           <Button transparent onPress={()=>this.saveChanges(this.state.data[index],index)}>
                             <Icon type="MaterialIcons" name="save" style={{color:'blue'}}/>
                           </Button> 
                           :
                           <Button transparent onPress={()=>{this.setState({editing:true})}}>
                             <Icon type="AntDesign" name="edit" style={{color:'green'}}/>
                           </Button>
                         
                        }
                        
                        </View>
                         
                    </View>
                    
                    )}
                    /> 
                    
                     </Content>
            </View>
        )
    }
}
