import React, { Component } from 'react'
import { Text, View } from 'react-native'
import {f} from '../firebaseConfig/config';
import {FlatList} from'react-native';


export default class Questions extends Component {

    state={
        refresh:false,
        data:null,
    }






    componentWillMount(){
        let uid=f.auth().currentUser.uid;
        f.database().ref(`Questions/${uid}`).once('value', snapshot=> {
          const exists=(snapshot.val() !=null);
          if(exists){
            
            const Questions = snapshot.val();
            let newData=[];
            Object.values(Questions).forEach(function (item) {
              newData.push({item});
            
            });
            console.log(newData,newData);
            this.setState({data:newData});
            // console.log('databse',this.state.data);
          } 
        }).catch((err)=>console.log(err));
      }



      loadNew=()=>{
        this.setState({refresh:true,data:null});
           this.componentWillMount();
           this.setState({refresh:false});
       }




    render() {
        return (
            <View style={{flex:1}}>
                <FlatList
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.data}
                    keyExtractor={(item,index)=>index.toString()}
                    renderItem={({item,index}) => (
                    <View key={index} style={{borderWidth:1}}>
                        <Text>{item.item.title}</Text>
                    </View>
                    )}
                    />
            </View>
        )
    }
}
