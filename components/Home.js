import React, { Component } from 'react';

import { Button,Text,Icon,Footer, FooterTab,View} from 'native-base';
import AddQuestion from './AddQuestion';
import MyQuestions from './MyQuestions';
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



  render() {
    
    console.log('response in home',this.state.res);
    let AppComponent = null;

    if (this.state.index == 0) {
       AppComponent = <MyQuestions/>
    } else if(this.state.index==1) {
       AppComponent = <AddQuestion/>
    }
    else{
      AppComponent=<Questions/>
    }
    return (
      
      <View style={{flex:1}}>
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
            <Text> My Questions</Text>
            <Icon type="AntDesign" name='profile' />
            </Button>
        </FooterTab>
    </Footer>
    </View>
    );
  }
}
