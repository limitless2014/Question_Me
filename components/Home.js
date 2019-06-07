import React, { Component } from 'react';
import { View, Text} from 'react-native';
import {Container,Header,Content,Item,Input,Textarea, Button} from 'native-base'
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.navigate=this.props.navigation.navigate;
    
  }

  state={
    response:this.props.navigation.state.params.res
  }
  static navigationOptions = {
    header: null
}

  render() {
    return (

        <Container>
        <Content>
        <Text style={{textAlign:'center',fontWeight:'bold'}}> Welcome {this.state.response.user.email} {this.state.response.additionalUserInfo.isNewUser ? 'write Your first question!' : null} </Text>
          <Item rounded>
            <Input placeholder='Question Title'/>
            
          </Item>
          
          <Textarea style={{marginHorizontal:8}} rowSpan={5} bordered placeholder="Subject"/>
           <Button style={{alignSelf:'center',marginTop:8}}><Text>Create Question</Text></Button>
        </Content>
      </Container>
      
    );
  }
}
