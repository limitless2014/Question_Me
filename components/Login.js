import React, { Component } from 'react';
import { View, Text,TextInput,Button,ToastAndroid,AsyncStorage,ImageBackground,CheckBox,Image } from 'react-native';
import {f,auth} from '../firebaseConfig/config'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import { TextLoader,LinesLoader} from 'react-native-indicator';




export default class Login extends Component {
  constructor(props) {
    super(props);
    this.navigate=this.props.navigation.navigate;
     
  }

state={
  username:'',
  PassWord:'',
  loading:false,
  showPassword:true
  
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
                this.props.dispatch({ type: 'SET_RESPONSE',res });
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



  
  
 onLoginOrRegister = () => {
  this.setState({loading:true});
   GoogleSignin.configure({webClientId:"1060035696998-5n89ka56sbqjfvh582eq7jtvhjfgor6n.apps.googleusercontent.com"});
  GoogleSignin.signIn()
    .then((data) => {
      // Create a new Firebase credential with the token
      const credential = f.auth.GoogleAuthProvider.credential(data.idToken);
      // Login with the credential
      return f.auth().signInWithCredential(credential)
    
    }).then((user)=>{
        if(user.user.emailVerified){
         this.props.dispatch({ type: 'SET_USER',user });
         this.setState({loading:false});
        this.navigate('Home');
        }
        else{
          res.user.sendEmailVerification().then(console.log('email verification sent'));
        }

    })
    .catch((error) => {
      console.log(error)
    });
}



  render() {
    if(this.state.loading){
      return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
         <LinesLoader color="red" />
         <TextLoader text="Logging In" />
        </View>);
    }
    return (
        <View style={{flex:1}}>
          <Image style={{width:200,height:200,alignSelf:'center'}} resizeMode="contain" source={require('../assets/question1.jpg')}/>
      
      
        
           <View style={{justifyContent:'center',alignItems:'center',width:'50%',alignSelf:'center'}}>
            <TextInput defaultValue={this.state.username}  onChangeText={(txt)=>this.setState({username:txt})} placeholder="Email"
            autoCompleteType={"email"}
             style={{width:'100%',borderWidth:1,backgroundColor:'white'}}/>
            <TextInput defaultValue={this.state.PassWord}  onChangeText={(txt)=>this.setState({PassWord:txt})} secureTextEntry={this.state.showPassword}
             placeholder="PassWord"  style={{width:'100%',marginVertical:8,borderWidth:1,backgroundColor:'white'}}/>
            </View>
            <View style={{width:'50%',flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
            <CheckBox value={!this.state.showPassword} onValueChange={()=>{this.setState({showPassword:!this.state.showPassword})}}/>
            <Text>Show Password</Text>
            </View>
          <View style={{width:'50%',alignSelf:'center'}}>
            <Button title="Login" onPress={()=>this.showLoginForm()} /> 
            </View>
            <View style={{width:'50%',marginTop:10,alignSelf:'center'}}>
             <Button title="SignUp" color='red' onPress={()=>this.showSignUpForm()}/>
            </View>
            <View style={{width:'50%',marginTop:10,position:'absolute',bottom:'10%',alignSelf:'center'}} >
              <GoogleSigninButton
              style={{ width: '100%', height: 48 }}
              size={GoogleSigninButton.Size.Wide}
              color={GoogleSigninButton.Color.Dark}
              onPress={()=>this.onLoginOrRegister()}
              disabled={this.state.isSigninInProgress} />
              </View>
      
      </View>
    
    );
  }
}




 