import React, { Component } from "react";
import axios from "axios";
import socketIOClient from "socket.io-client";

import CategoryPage from './components/CategoryPage'
import "./App.css";
import EventManager from "./components/EventManager";
import AppDescription from "./components/AppDescription";

import { BrowserRouter, Route, Redirect, withRouter, Switch } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { action } from "mobx";
import Navbar from "./components/Navbar";
import Rsvp from "./components/Rsvp";
import EventsPage from './components/EventsPage'
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#212121", light: "#9e9e9e" },
    secondary: { main: "#560027" },
    white: { main: '#fff' }
  }
});


@inject("store")
@observer
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvpfunc: false,
      // endpoint: "http://127.0.0.1:3001"
      endpoint: "https://beourguest.herokuapp.com"
    };
  }

  @action
  updateTablesInDb = () => { };

  @action
  componentWillMount() {
    let user = JSON.parse(localStorage.getItem("beOurGuestUser"));
    console.log("WILL MOUNT");
    console.log(user);
    let eventIndex = JSON.parse(localStorage.getItem("beOurGuestEventIndex"));

    if (user !== null) {
      // console.log(user.username);
      axios
        .post("/beOurGuest/login", { name: user.username, pass: user.password })
        .then(response => {
          if (response.data !== "") {
            this.props.store.updateUser(response.data);
            if (eventIndex !== null) {
              // console.log("eventIndex   ===" + eventIndex)
              this.props.store.thisEventIndex(eventIndex);
            }
          } else {
            // console.log("no user Account ")
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  onDragStart = result => {
    console.log("start");
  };

  onDragUpdate = result => {
    console.log("update");
  };

  ChangeToRsvpPage = e => {
    this.setState({ rsvpfunc: true });
  };
  updetGuset = obj => {
    let events = this.props.store.user.events;
    for (let index = 0; index < events.length; index++) {
      //get event index
      if (events[index]._id == obj.eventId) {
        // console.log("event index : " + index)
        for (let i_g = 0; i_g < events[index].guests.length; i_g++) {
          // get gest indes
          if (events[index].guests[i_g]._id == obj.guestId) {
            console.log("guest index : " + i_g);
            this.props.store.realTimeRsvp(
              index,
              i_g,
              obj.coming,
              obj.notComing
            );
            break;
          }
        }
      }
    }
  };
  render() {
    const store = this.props.store;
    const socket = socketIOClient(this.state.endpoint);
    socket.on("backRsvp", obj => {
      // console.log(JSON.stringify(obj))
      this.updetGuset(obj);
    });

    console.log(store.user.userLog);
    console.log(store.eventIndex);
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App" >
          {!this.state.rsvpfunc && <Navbar />}

            <div style={{
              /*  position: "absolute",
               top: 64,
               bottom: 0,
               left: 0,
               height: "100%",
               width: "100%", */
              flex: " 1 1 auto",
            }}>
            {/*   {!this.state.rsvpfunc &&
                store.eventIndex != null &&
                  store.user.userLog && store.currentPage === "" && <Redirect to={"/" + store.user._Id + "/event/"
                    + store.user.events[store.eventIndex]._id + "/"} />} */}
           {/*    {store.user.userLog && !this.props.store.eventIndex &&  store.currentPage === "" && <Redirect to={"/user/" + store.user._Id} />} */}
             {/*  { store.user.userLog && store.currentPage === "events"  && !this.state.rsvpfunc &&
                store.eventIndex == null && <Redirect to={"/" + store.user._Id + "/events/"} />}
              { store.user.userLog &&  store.currentPage === "categories" && store.eventIndex == null && !this.state.rsvpfunc &&
              <Redirect to={"/" + store.user._Id + "/categories/"} />} */}




              <Switch>
                {
                  <Route exact path="/" component={() =>
                   !store.user.userLog ? <AppDescription/>
                    : (store.eventIndex ?
                     <Redirect to={"/" + store.user._Id + "/event/"
                    + store.user.events[store.eventIndex]._id + "/"} /> 
                    :  <Redirect to={"/" + store.user._Id + "/events/"} />)} />
                }

               
                <Route exact path="/:userId/events/" component={EventsPage} />
                <Route exact path="/:userId/event/:eventId" component={EventManager} />

                <Route exact path="/:userId/categories/" component={CategoryPage} />


                <Route
                  exact
                  path="/beuorguest/rsvp/:vetId/:eventId/:guestId/"
                  render={props => (
                    <Rsvp {...props} ChangeToRsvpPage={this.ChangeToRsvpPage} />
                  )}
                />
              </Switch>
            </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App);
