import React, { Component } from 'react';

import { Button,Text,Icon,Drawer,Header,Left,Body,Title,Right,Footer, FooterTab} from 'native-base';
import SideBar from './sidebar';
import AddQuestion from './AddQuestion';
import Profile from './Profile';
import Questions from './Questions';



 export default class Home extends Component {
  constructor(props) {
    super(props);
    this.navigate=this.props.navigation.navigate;
}


 state={
   res: this.props.res.res,
   active:true,
   index:0,
 }


  static navigationOptions = {
    header: null
}

switchScreen(index) {
  this.setState({index: index})
}

closeDrawer=()=>{
  this.drawer._root.close();
  }

  openDrawer=()=>{
   this.drawer._root.open();
  }


  render() {
    
    console.log('response in home',this.state.res);
    let AppComponent = null;

    if (this.state.index == 0) {
       AppComponent = <Profile/>
    } else if(this.state.index==1) {
       AppComponent = <AddQuestion/>
    }
    else{
      AppComponent=<Questions/>
    }
    return (
      <Drawer
      ref={(ref)=>this.drawer=ref}
      content={<SideBar response={this.state.res} navigate={this.props.navigation.navigate}/>}
      side="left"
      onClose={()=>this.closeDrawer()}
      >
      
        <Header>
        <Left style={{flex:1}}>
            <Button onPress={()=>this.openDrawer()} transparent>
            <Icon  name='menu' />
            </Button>
          </Left>
        <Body style={{flex:1,justifyContent: 'center', alignItems: 'center'}}>
          <Title>Question Me</Title>
          </Body>
          <Right style={{flex:1}}/>
      </Header>

      {AppComponent}
     
     <Footer >
          <FooterTab>
            <Button onPress={()=>this.switchScreen(2)} active={this.state.index ===2 ? true : false} >
            <Text>Questions</Text>
                <Icon type="MaterialCommunityIcons" name='comment-question' />
            </Button>
            </FooterTab>
            <FooterTab>
            <Button onPress={()=>this.switchScreen(1)} active={this.state.index ===1 ? true : false} >
                <Text>Add Question</Text>
                <Icon type="MaterialIcons" name='add-circle' />
            </Button>
          </FooterTab>
            <FooterTab>
            <Button onPress={()=>this.switchScreen(0)} active={this.state.index ===0 ? true : false} >
            <Text> Profile</Text>
            <Icon type="FontAwesome" name='user-circle-o' />
            </Button>
        </FooterTab>
    </Footer>
    </Drawer>
    );
  }
}
