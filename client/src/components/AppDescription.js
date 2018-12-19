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
import { flow } from "mobx";


// let imgUrl = "./../pic3.jpg";
let imgUrl = "./../summer_09.jpg";
const styles = theme => ({
  description: {
    position: "absolute",
    top:0,
    marginTop:"10%",
    padding: 10,
    left:"50%",
    justifyContent: "center",
    color: "white",
    fontStyle: "normal",
   
  },
  bogImage: {
    backgroundImage: "url(" + imgUrl + ")",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "92vh",
    clipPath: "polygon(0 0, 21% 0, 56% 100%, 0% 100%)",


  },
  button: {
    marginTop: 15,
    padding: 20,
    backgroundColor: theme.palette.primary.main,
    borderColor: 'white',
    color: 'white',
    zIndex: 10
  },
  bg: {
    backgroundColor: theme.palette.secondary.main,
  }, 
  header: {
   fontSize: "3rem", 
   textShadow: "2px 5px 2px rgba(2,8,12,0.54)",
   fontFamily: 'Calligraffitti, cursive',
   paddingBottom: 5,
   fontWeight: 500,


  }
});

@inject("store")
@observer
class AppDescription extends Component {
  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.bg}>

        <div className={classes.bogImage}> 
        
        </div>
        <div className={classes.description}>
          <h1 className={classes.header}>Be Our Guest!</h1>
          <h2 style={{fontWeight: 100}}>The ultimate app to manage your event</h2>{" "}
          <h5 style={{fontWeight: 400}}>create a guest list</h5>
          <h5 style={{fontWeight: 400}}>create and send invitations</h5>
          <h5 style={{fontWeight: 400}}>track RSVPs</h5>
          <h5 style={{fontWeight: 400}}>arrange guest seating</h5>
          <h3 style={{fontWeight: 400}}>and much much more...</h3>{" "}


          <h2>Sign in to create new event!</h2>

          <Button variant="outlined" className={classes.button} onClick={this.props.store.openModalLogin} >
            Sign Up or Login
      </Button>
          <LogIn />
        </div>


      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(AppDescription);
