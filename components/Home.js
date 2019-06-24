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
   user:this.props.res.user
 }


  static navigationOptions = {
    header: null
}

switchScreen(index) {
  this.setState({index: index})
}



  render() {
    
   
    let AppComponent = null;

    if (this.state.index == 0) {
       AppComponent = <MyQuestions res={this.state.res} user={this.state.user} navigate={this.navigate}  />
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
          <FooterTab  style={{backgroundColor:'black'}} >
            <Button onPress={()=>this.switchScreen(2)} active={this.state.index ===2 ? true : false} >
           
                <Icon type="MaterialCommunityIcons" name='comment-question' />
            </Button>
            </FooterTab>
            <FooterTab style={{backgroundColor:'black'}}>
            <Button onPress={()=>this.switchScreen(1)} active={this.state.index ===1 ? true : false} >
               
                <Icon type="MaterialIcons" name='add-circle' />
            </Button>
          </FooterTab >
            <FooterTab style={{backgroundColor:'black'}}>
            <Button onPress={()=>this.switchScreen(0)} active={this.state.index ===0 ? true : false} >
            
            <Icon type="MaterialIcons" name='account-circle' />
            </Button>
        </FooterTab>
    </Footer>
    </View>
    );
  }
}
