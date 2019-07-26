import React, { Component } from 'react'
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch, Title } from 'native-base';


export default class CategoryPage extends Component {
    render() {
        return (
            <Container>
        <Header style={{justifyContent:'center',alignItems:'center'}}>
            <Title>Find By Category</Title>
        </Header>
        <Content>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "#FF9501" }}>
                <Icon active type="MaterialIcons" name="computer" />
              </Button>
            </Left>
            <Body>
              <Text>Computer and Technology</Text>
            </Body>
            <Right>
            <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "green" }}>
                <Icon active type="MaterialCommunityIcons" name="bio" />
              </Button>
            </Left>
            <Body>
              <Text>Biology</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "red" }}>
                <Icon active type="Entypo" name="music" />
              </Button>
            </Left>
            <Body>
              <Text>Music</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button style={{ backgroundColor: "black" }}>
                <Icon active type="FontAwesome" name="history" />
              </Button>
            </Left>
            <Body>
              <Text>History</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button>
                <Icon active type="MaterialCommunityIcons" name="movie" />
              </Button>
            </Left>
            <Body>
              <Text>Movie and Cinema</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem icon>
            <Left>
              <Button transparent>
                <Icon active type="Ionicons" name="ios-football" />
              </Button>
            </Left>
            <Body>
              <Text>Sport</Text>
            </Body>
            <Right>
              <Icon active name="arrow-forward" />
            </Right>
          </ListItem>
        </Content>
      </Container>
        )
    }
}
