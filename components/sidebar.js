import React, { Component } from 'react';
import {StyleSheet,BackHandler,Linking,ImageBackground} from 'react-native';
import {Container,Content,List,ListItem,Left,Right,Text, Button, Icon, Footer,Thumbnail, Body, Title } from 'native-base';
import {auth} from '../firebaseConfig/config'



export default class SideBar extends Component {
 

  render() {
    
    return (
      <Container style={styles.containerStyle}>
          <Content style={styles.content}>
          <ImageBackground style={{width:'100%',height:150}} source={require('../assets/drawer.jpg')} resizeMode= 'stretch'>
          <Thumbnail style={{margin:10}}  source={require('../assets/user.png')}/>
          <Text style={{margin:10}}> {this.props.response.user.email}</Text>
          <Button transparent style={{width:'90%',alignSelf:'center',alignItems:'center',justifyContent:'center',height:30}}
            onPress={()=>{auth.signOut();this.props.navigate('Login')}} ><Text style={{textAlign:'center',color:'red',fontWeight:'bold'}}>LogOut</Text></Button>
          </ImageBackground>
          <List>
          
          <ListItem style={{borderBottomWidth:1,borderBottomColor:'blue'}} onPress={()=>this.props.navigate('About')}>
            
            <Right>
              <Button transparent>
                <Icon type="Entypo" name="info"/>
              </Button>
            </Right>
            <Left style={{flex:1}}>
            <Text >About app</Text>
            </Left>
          </ListItem>
          <ListItem style={{borderBottomWidth:1,borderBottomColor:'blue'}} onPress={()=>BackHandler.exitApp()}>
          
            <Right>
              <Button transparent>
                <Icon type="MaterialIcons" name="exit-to-app"/>
              </Button>
            </Right>
            <Left style={{flex:1}}>
            <Text >Exit App</Text>
            </Left>
          </ListItem>
        </List>

        
          </Content>
         
          <Footer style={{alignItems:'center',justifyContent:'space-around',backgroundColor:'white'}}>
            
            
            <Icon type="FontAwesome" name="instagram" style={{color:'red'}} onPress={()=>Linking.openURL("https://www.instagram.com/limitless2014/")}/>
            
            <Icon type="FontAwesome" name="whatsapp"  onPress={()=>Linking.openURL("https://api.whatsapp.com/send?phone=989167359331")} style={{color:'green'}}/>
           
            <Icon type="FontAwesome" name="telegram" onPress={()=>Linking.openURL("https://t.me/limitless2014")}   />
            
          </Footer>
          


      </Container>
    )
  }
}

const styles=StyleSheet.create({
    containerStyle:{
        flex:1,
        backgroundColor:'#fff'
    },
    content:{
      width:'100%',
        flexDirection:'column'
      
    }
})