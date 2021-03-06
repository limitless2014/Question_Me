import React, { Component } from 'react'
import { Text, View ,FlatList,TouchableHighlight,ImageBackground,ToastAndroid} from 'react-native'
import {f, auth} from '../firebaseConfig/config';
import {Button, Icon,Spinner,Header,Content,Thumbnail,Input,Item} from 'native-base'
import AnswersPage from './AnswersPage';

 export default class Questions extends Component {


    state={
        refresh:false,
        data:null,
        details:false,
        answers:[],
        loading:false,
        item:null,
        index:null,
        searchTerm:''
    }
   

    static navigationOptions = {
      header: null
  }


    componentWillMount(){
      //fetching question
        this.setState({loading:true});
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
            this.setState({data:newData,loading:false});
            this.arrayHolder=newData;
          } 
          else{
            this.setState({loading:false});
          } 
        }).catch((err)=>{console.log(err);this.setState({loading:false})})
      }



      loadNew=()=>{
        this.setState({refresh:true,data:null});
           this.componentWillMount();
           this.setState({refresh:false});
       }

       goback=()=>{
       this.setState({details:false});
       }

       like=(key,rootkey,index)=>{
        let updatedlikes=this.state.data[index].val.likes+1;
        let updatedLikeColor=this.state.data[index].val.likeColor='grey';
        let updatedDislikeColor=this.state.data[index].val.dislikeColor='grey';
        let disabledBtn=this.state.data[index].val.disabled=true;
        let newData=[...this.state.data];
        
        newData[index].likeColor=updatedLikeColor;
        newData[index].dislikeColor=updatedDislikeColor;
        newData[index].disabled=disabledBtn;
        

        
        if(this.state.data[index].val.users[0]==="")
        {
            let users=[];
            users.push(auth.currentUser.uid);
            newData[index].val.likes=updatedlikes;
            this.setState({data:newData});
            f.database().ref(`Questions/${rootkey}/${key}/`).update({likes:updatedlikes,users:users});
        }else{
          let users=this.state.data[index].val.users;
          if(users.find((user)=>{return user===auth.currentUser.uid;}))
          {
            ToastAndroid.show('You can like or Dislike a question once!',ToastAndroid.SHORT);
            this.setState({data:newData});
          }else{
            let users=this.state.data[index].val.users;
            users.push(auth.currentUser.uid);
            newData[index].val.likes=updatedlikes;
            this.setState({data:newData});
            f.database().ref(`Questions/${rootkey}/${key}/`).update({likes:updatedlikes,users:users});
          }

        }
        
       }

       dislike=(key,rootkey,index)=>{
        let updateddislikes=this.state.data[index].val.dislikes+1;
        let updatedLikeColor=this.state.data[index].val.likeColor='grey';
        let updatedDislikeColor=this.state.data[index].val.dislikeColor='grey';
        let disabledBtn=this.state.data[index].val.disabled=true;
        let newData=[...this.state.data];


       
        newData[index].likeColor=updatedLikeColor;
        newData[index].dislikeColor=updatedDislikeColor;
        newData[index].disabled=disabledBtn;

        if(this.state.data[index].val.users[0]==="")
        {
            let users=[];
            users.push(auth.currentUser.uid);
            newData[index].val.dislikes=updateddislikes;
            this.setState({data:newData});
            f.database().ref(`Questions/${rootkey}/${key}/`).update({dislikes:updateddislikes,users:users});
        }else{
          let users=this.state.data[index].val.users;
          if(users.find((user)=>{return user===auth.currentUser.uid;}))
          {
            ToastAndroid.show('You can like or Dislike a question once!',ToastAndroid.SHORT);
            this.setState({data:newData});
          }else{
            let users=this.state.data[index].val.users;
            users.push(auth.currentUser.uid);
            newData[index].val.dislikes=updateddislikes;
            this.setState({data:newData});
            f.database().ref(`Questions/${rootkey}/${key}/`).update({dislikes:updateddislikes,users:users});
          }

        }

       }


    
       itemPressed=(item,index)=>{
        let answersArray=[];
        this.setState({loading:true});
        f.database().ref(`Questions/${item.rootkey}/${item.key}/answers`).once('value', snapshot=> {
          const exists=(snapshot.val() !=null);
          if(exists){
            const answers=snapshot.val();
            Object.entries(answers).forEach(([key, val])=> {
              answersArray.push(val);
            });
           }
           this.setState({loading:false,item:item,index:index,answers:answersArray,details:true});
        }).catch((err)=>console.log(err));
        
         
         
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


       search=(txt)=>{
        if (!txt || txt === '') {
        this.setState({
          searchTerm: txt
        })
      }
      let newData = this.arrayHolder.filter((question)=> {
        let title=[];
        title=question.val.title.toLowerCase();
        let comments=[];
        comments=question.val.comments.toLowerCase();
        if(title.includes(txt.toLowerCase())){
          question=title;
          return question; 
        }
        else if(comments.includes(txt.toLowerCase()))
        {
         question=comments;
         return question;
        }
      })
      this.setState({data:newData})
      
     }




    render() {
         if(this.state.details)
         {
           return <AnswersPage user={this.props.user} item={this.state.item} data={this.state.data} answers={this.state.answers} index={this.state.index} goback={()=>this.goback()}   />
         }

         if(this.state.loading){
          return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                 <Spinner color='blue' />
                 </View>
        }


        return (
                <View style={{flex:1}} >
                   <Header searchBar rounded>
                    <Item>
                      <Icon name="ios-search" />
                      <Input placeholder="Search" onChangeText={(txt)=>this.search(txt)} />
                      <Button transparent>
                      <Icon name="filter" type="MaterialCommunityIcons" style={{color:'black'}} />
                      </Button>
                    </Item>
                    <Button transparent>
                      <Text>Search</Text>
                    </Button>
                  </Header>
                <Content padder>
                <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.data}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index}) => (
                      <TouchableHighlight underlayColor={'red'}   key={index}  onPress={()=>this.itemPressed(item,index) }>
                    <View
                     style={{flex:1,flexDirection:'column',justifyContent:'flex-end',borderWidth:1,borderTopRightRadius:10
                     ,borderBottomLeftRadius:10,borderBottomRightRadius:10,margin:5}}
                     >
                       <ImageBackground source={require('../assets/question1.jpg')} resizeMode="center" style={{width:'100%'}}>  
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      {this.props.user !==undefined ?<Thumbnail style={{margin:5}} small source={{uri:this.props.user.user.photoURL}}/>  :
                       <Thumbnail style={{margin:5}} large source={{uri:"https://cdn4.iconfinder.com/data/icons/political-elections/50/48-512.png"}}/>
                      }
                      <Text style={{fontWeight:'bold',margin:5}}> {item.val.author}</Text>
                      <Text style={{margin:5}}>{this.timeConvertor(item.val.date)}</Text>
                      
                      </View>
                        <Text style={{margin:5,fontWeight:'bold'}}>{item.val.title}</Text>
                        <Text style={{margin:5}}>{item.val.comments}</Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                        <Button transparent disabled={item.val.disabled}  style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.like(item.key,item.rootkey,index)}>
                        <Text>{this.state.data[index].val.likes}</Text>
                          <Icon type="AntDesign" name="like2" style={{color:item.val.likeColor}}  />
                        </Button>
                        <Button transparent disabled={item.val.disabled} style={{margin:5,justifyContent:'center',marginLeft:5}} onPress={()=>this.dislike(item.key,item.rootkey,index)} >
                        <Text>{this.state.data[index].val.dislikes}</Text>
                          <Icon type="AntDesign" name="dislike2" style={{color:item.val.dislikeColor}}   />
                        </Button>
                        </View>
                        </ImageBackground>
                    </View>
                    </TouchableHighlight>
                    )}
                    />
                    </Content>
                </View>
                    
        )
    }
}

