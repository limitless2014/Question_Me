import React, { Component } from 'react'
import { Text, View,FlatList,TouchableHighlight } from 'react-native'
import {f} from '../firebaseConfig/config';
import {Button, Icon,Spinner,Header,Left,Body,Title,Right,Content, Thumbnail} from 'native-base'
import * as Progress from 'react-native-progress';
import { auth } from 'firebase';

export default class MyQuestions extends Component {

    state={
        refresh:false,
        data:null,
        loading:false,

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
                newData.push({val});
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
      if(likenum==dislikenum){
        return 0.5;
      }
      else if(dislikenum<likenum){
        let result=dislikenum-likenum/likenum;
        return 1-result/10;
      }
       
       
     
      
    }

    calcDislikePercentage=(likes,dislikes)=>{
      let likenum=parseInt(likes);
      let dislikenum=parseInt(dislikes);
      if(likenum==dislikenum){
        return 0.5;
      }
      else if(dislikenum<likenum){
        let result=dislikenum-likenum/likenum;
        return result/10;
      }
       
       
     
      
    }

       

       
    render() {
   
     console.log('user',this.props.user);
     console.log('res',this.props.res);
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
                 <Button block onPress={()=>{f.auth().signOut();this.props.navigate('Login')}} 
                 style={{backgroundColor:'purple'}}><Text>LogOut</Text></Button>
                 <Content padder/>
                 
                    <Text style={{textAlign:'center',fontWeight:'bold',paddingBottom:5, borderBottomWidth:1.5}}>Your Questions</Text>
                   
                  <Content padder/>
                  
                 <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.data}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index}) => (
                  <TouchableHighlight underlayColor={'green'}   key={index}  onPress={()=>console.log('item pressed') }>
                    <View 
                     style={{flex:1,flexDirection:'column',justifyContent:'flex-end',borderWidth:1,borderTopRightRadius:10
                     ,borderBottomLeftRadius:10,borderBottomRightRadius:10,margin:5,height:150}}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <Text style={{fontWeight:'bold',margin:5}}>Author : {item.val.author}</Text>
                      <Text style={{margin:5}}>{this.timeConvertor(item.val.date)}</Text>
                       
                      </View>
                        <Text style={{margin:5}}>{item.val.title}</Text>
                        <Text style={{margin:5}}>{item.val.comments}</Text>
                        {/* <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}} >
                        <Text>{this.state.data[index].val.likes}</Text>
                          <Icon type="AntDesign" name="like2" style={{color:'green'}} />
                        </Button>
                        <Button transparent  style={{margin:5,justifyContent:'center',marginLeft:5}}  >
                        <Text>{this.state.data[index].val.dislikes}</Text>
                          <Icon type="AntDesign" name="dislike2" style={{color:'red'}} />
                        </Button>
                        
                        
                        </View> */}
                        <View style={{flexDirection:'row'}}>
                        <Progress.Circle style={{margin:10}} progress={this.calcLikePercentage(this.state.data[index].val.likes,this.state.data[index].val.dislikes)}
                        size={50} showsText={true} formatText={()=>{return 'Likes'}} />
                        <Progress.Circle style={{margin:10}} progress={this.calcDislikePercentage(this.state.data[index].val.likes,this.state.data[index].val.dislikes)}
                        size={50} showsText={true} formatText={()=>{return 'Dislikes'}} color="red" />
                        </View>
                    </View>
                    </TouchableHighlight>
                    )}
                    /> 
                    
                     </Content>
            </View>
        )
    }
}
