import React, { Component } from "react";
import { Jumbotron, Container, Row, Col } from "reactstrap";
import {
  withStyles,
  withTheme,
  Button
} from "@material-ui/core";
import LogIn from './LogIn';

import { observer, inject } from "mobx-react";
import axios from "axios";


// let imgUrl = "./../pic3.jpg";
let imgUrl = "./../summer_09.jpg";
const styles = theme => ({
  description: {
    justifyContent: "center",
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 54,
    marginBottom: 15,
    marginLeft: 260,
    marginRight: 260,
    backgroundColor: "rgba(74, 27, 54, 0.73)",
    borderRadius: 20,
    color: "white",
    fontStyle:"normal",
    boxShadow:" 0 14px 28px rgba(0, 0, 0, 0.88), 0 10px 10px #212121a8",
  },
  bogImage: {
    backgroundImage: "url(" + imgUrl + ")",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height:"100%",
    
  
  },
  button: {
    marginTop: 10,
    padding: 20,
    backgroundColor: theme.palette.primary.main,
    borderColor: 'white',
    color: 'white',
    zIndex: 10
  }
});

@inject("store")
@observer
class AppDescription extends Component {
  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.bogImage}>
        <br />
        <div className={classes.description}>
          <Container>
            
              <Row>
                <Col sm="12" md={{ size: 10, offset: 1 }}>
                  <h1>Be Our Guest!</h1>
                  <h2>The ultimate app to manage your event</h2>{" "}
                  <h5>create a guest list</h5>
                  <h5>create and send invitations</h5>
                  <h5>track RSVPs</h5>
                  <h5>arrange guest seating</h5>
                  <h3>and much much more...</h3>{" "}
                </Col>
              </Row>
              <h2>Sign in to create new event!</h2>
           
            <Button variant="outlined" className={classes.button} onClick={this.props.store.openModalLogin} >
            Sign Up or Login
      </Button>
            <LogIn />
          </Container>


        </div>
        <br />
        <br />
        <br />

      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(AppDescription);
