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
      endpoint: "https://beourguest.herokuapp.com",
      loading: false,

      rendered: false
    };
  }

  @action
  updateTablesInDb = () => { };

  @action
  componentDidMount() {
    if (this.state.rendered === false)
      this.setState({ rendered: true })
    let user = JSON.parse(localStorage.getItem("beOurGuestUser"));
    console.log("APP - componentDidMount()");
    let eventIndex = JSON.parse(localStorage.getItem("beOurGuestEventIndex"));
    if (user) {
      this.setState({ loading: true });
      axios
        .post("/beOurGuest/login", { name: user.username, pass: user.password })
        .then(response => {
          if (response.data !== "") {
            this.props.store.updateUser(response.data);
            if (eventIndex !== null) {
              this.props.store.thisEventIndex(eventIndex);

            }


          } else {
             console.log("no user Account ")
          }
          this.setState({ loading: false });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }

  ChangeToRsvpPage = e => {
    this.setState({ rsvpfunc: true });
  };
  updetGuset = obj => {
    let events = this.props.store.user.events;
    for (let index = 0; index < events.length; index++) {
      //get event index
      if (events[index]._id == obj.eventId) {
        for (let i_g = 0; i_g < events[index].guests.length; i_g++) {
          // get gest indes
          if (events[index].guests[i_g]._id == obj.guestId) {
            
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
      this.updetGuset(obj);
    });

    let userLocalStorage = JSON.parse(localStorage.getItem("beOurGuestUser"));
   
    //data of user/eventIndex is still loading
    if (this.state.loading)
      return null;
      //first render with no user in localstorage (even if not root page)
    if (!this.state.rendered && !store.user.userLog && !userLocalStorage)
      return <Redirect to="/" />;

      //not first render but localStorage user is still not updated to store
    if (!store.user.userLog && userLocalStorage)
      return null;

      //By now, if there is no localStroge, or if we have completed the retrieval of all the data to the store,
      // we get here
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App" >
          {!this.state.rsvpfunc && <Navbar />}

          <div style={{
            flex: " 1 1 auto",
          }}>
            
            <Switch>
              {
                <Route exact path="/" component={() =>
                  !store.user.userLog ? <AppDescription />
                    : (store.eventIndex !== null ?
                      <Redirect to={"/" + store.user._Id + "/event/" + store.user.events[store.eventIndex]._id + "/"} />
                      : <Redirect to={"/" + store.user._Id + "/events/"} />)} />
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
