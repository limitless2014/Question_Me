import React, { Component } from 'react';
import { View, Text,TextInput,Button,ToastAndroid,AsyncStorage,ActivityIndicator,ImageBackground } from 'react-native';
import {f,auth} from '../firebaseConfig/config'





export default class Login extends Component {
  constructor(props) {
    super(props);
    this.navigate=this.props.navigation.navigate;

  }

state={
  username:'',
  PassWord:'',
  loading:false
  
}


  static navigationOptions = {
    header: null
}

componentDidMount(){
    AsyncStorage.getItem('@userid:username').then((username)=>{
        this.setState({username:username})
    });
    AsyncStorage.getItem('@userpass:password').then((password)=>{this.setState({PassWord:password})});

}

 showLoginForm=()=>{
     
     if(this.state.PassWord !=''&& this.state.username !='')
    {
        this.setState({loading:true});
        auth.signInWithEmailAndPassword(this.state.username,this.state.PassWord).then(
           (res)=> { 
               if(res.user.emailVerified==true){
                AsyncStorage.setItem('@userid:username',this.state.username);
                AsyncStorage.setItem('@userpass:password',this.state.PassWord);
                this.setState({loading:false});
                console.log(res);
                this.props.dispatch({ type: 'SET_RESPONSE',res });
                console.log('redux',this.props.res);
                this.navigate('Home');
               }
               else{
                   ToastAndroid.show('An verification Email sent to your email',ToastAndroid.LONG);
                   this.setState({loading:false});
               }
         
           
        }

        ).catch(err=>{this.setState({loading:false});console.log(err)});
       
    }
   
 }

 showSignUpForm=()=>{
    

    if(this.state.PassWord !=''&& this.state.username !='')
    {
        this.setState({loading:true});
        auth.createUserWithEmailAndPassword(this.state.username,this.state.PassWord).then(
            (res)=> {
                if(res.user.emailVerified !=true){
                    res.user.sendEmailVerification().then(console.log('email verification sent'))
                }
                AsyncStorage.setItem('@userid:username',this.state.username);
                AsyncStorage.setItem('@userpass:password',this.state.PassWord);
                this.setState({loading:false})
                this.navigate('Home',{res});
         
        }
        ).catch(err=>{this.setState({loading:false});ToastAndroid.show(err.message,ToastAndroid.SHORT)});
    }
    
 }


  render() {
    return (
      <ImageBackground style={{width:'100%',height:'100%'}} resizeMode="stretch" source={require('../assets/background.png')}>
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            {this.state.loading ? <ActivityIndicator color="blue" size={"large"}/> : null}
           <View style={{justifyContent:'center',alignItems:'center',width:'50%'}}>
            <TextInput defaultValue={this.state.username}  onChangeText={(txt)=>this.setState({username:txt})} placeholder="Email"
             style={{width:'100%',borderWidth:1,borderRadius:40,backgroundColor:'white'}}/>
            <TextInput defaultValue={this.state.PassWord}  onChangeText={(txt)=>this.setState({PassWord:txt})} secureTextEntry={true}
             placeholder="PassWord"  style={{width:'100%',marginVertical:8,borderWidth:1,borderRadius:40,backgroundColor:'white'}}/>
            </View>
          <View style={{width:'50%'}}>
            <Button title="Login" onPress={()=>this.showLoginForm()} /> 
            </View>

            <View style={{width:'50%',marginTop:10}}>
             <Button title="SignUp" color='red' onPress={()=>this.showSignUpForm()}/>
            </View>
      </View>
      </ImageBackground>
    );
  }
}




 