import React, { Component } from "react";
import { Button, Form } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import socketIOClient from "socket.io-client";
import axios from "axios";
import { observer, inject } from "mobx-react";
@inject("store")
@observer
class Rsvp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invitationName: "",
      titleInput: "",
      textInput: "",
      background: "",
      titleColor: "",
      bodyColor: "",
      fontTitle: "",
      fontBody: "",
      whenEvent: "",
      whereEvent: "",

      arryComing: [],
      arryNotComing: [],
      coming: 0,
      notComing: 0,
      numInvited: "",
      vient: "",
      returnRsvp: false,
     // endpoint: "http://127.0.0.1:3001"
      endpoint: "https://beourguest.herokuapp.com",
      // endpoint: "https://beourguest.herokuapp.com/socket.io/?EIO=4&transport=websocket",
    };
  }
  send = () => {
    debugger;
    let guestId = this.props.match.params.guestId;
    let eventId = this.props.match.params.eventId;
    const socket = socketIOClient(this.state.endpoint);
    socket.emit("callRsvp", {
      coming: this.state.coming,
      notComing: this.state.notComing,
      guestId: guestId,
      eventId: eventId
    });
  };

  inSocket = () => {
    // console.log(" befer connected ")
    const socket2 = socketIOClient(this.state.endpoint);
    socket2.on("connect", () => {
      console.log("connected ");
    });
    // console.log(socket2)
  };

  onSelectConfirmed = e => {
    let coming = this.state.coming;
    let notComing = this.state.notComing;
    let numInvited = this.state.numInvited;
    let vient = this.state.vient;
    if (e.target.name === "coming") {
      coming = e.target.value;
      numInvited = vient - coming - notComing;
      notComing = vient - coming;
    }

    if (e.target.name === "notComing") {
      notComing = e.target.value;
      numInvited = vient - coming - notComing;
      coming = vient - notComing;
    }

    let setArryComing = [];
    let setArryNotComing = [];

    for (let index = 0; index <= coming; index++) {
      setArryComing.push(index);
    }
    for (let index = 0; index <= notComing; index++) {
      setArryNotComing.push(index);
    }

    this.setState({
      [e.target.name]: e.target.value,
      arryComing: setArryComing,
      arryNotComing: setArryNotComing,
      numInvited: numInvited
    });
  };
  Submitfunc = e => {
    e.preventDefault();
    this.send();

    //send the info to evntid,gustid
    let objRsvp = {
      coming: this.state.coming,
      notComing: this.state.notComing,
      numInvited: this.state.numInvited,
      guestId: this.props.match.params.guestId,
      eventId: this.props.match.params.eventId
    };
    axios.post("/beOurGuest/rsvp/guestAnswer/", objRsvp).then(response => {
      // console.log((response.data))
    });
    this.toggleSendRsvp(e);
  };

  componentWillMount = () => {
    this.inSocket();
    let guestId = this.props.match.params.guestId;

    axios.get(`/beOurGuest/rsvpGuest/guestId/${guestId}`).then(response => {
      // console.log("rsvpGuest")
      let item = response.data;
      this.setState({
        numInvited: item.numInvited,
        vient: item.numInvited
      });

      let newArry = [];
      for (let index = 0; index <= item.numInvited; index++) {
        newArry.push(index);
      }
      this.setState({ arryComing: newArry, arryNotComing: newArry });
      this.props.ChangeToRsvpPage();
      this.getUserInfo();
    });
  };
  toggleSendRsvp = e => {
    e.preventDefault();

    this.setState({
      returnRsvp: !this.state.returnRsvp
    });
  };

  getUserInfo = () => {
    let vetId = this.props.match.params.vetId;
    axios.get(`/beOurGuest/rsvpGuest/${vetId}`).then(response => {
      console.log("rsvpGuest getUserInfo");
      let item = response.data;
      this.setState({
        invitationName: item.invitationName,
        titleInput: item.titleInput,
        textInput: item.textInput,
        whenEvent: item.whenEvent,
        whereEvent: item.whereEvent,
        background: item.background,
        titleColor: item.titleColor,
        bodyColor: item.bodyColor,
        fontTitle: item.fontTitle,
        fontBody: item.fontBody,
        display_rsvp: true
      });
    });
  };

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-3" />
          <div className="col-sm-6">
            <br />
            <Form
              className="display_rsvp"
              onSubmit={this.toggleSendRsvp}
              style={{ backgroundColor: `${this.state.background}` }}
            >
              <div>
                <h2
                  style={{
                    color: `${this.state.titleColor}`,
                    fontFamily: `${this.state.fontTitle}`
                  }}
                >
                  {this.state.titleInput}
                </h2>
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    padding: "10px",
                    color: `${this.state.bodyColor}`,
                    fontFamily: `${this.state.fontBody}`
                  }}
                >
                  <h4>{this.state.textInput}</h4>
                </div>
                <p>
                  {this.state.whenEvent} <br /> {this.state.whereEvent}
                </p>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-4">
                  <label htmlFor="">Coming</label>
                  <div className="rsvpInput">
                    {/* {this.SetComing(this.state.coming)} */}
                    <select
                      className="form-control"
                      id="coming"
                      value={this.state.coming}
                      onChange={this.onSelectConfirmed}
                      name="coming"
                    >
                      {this.state.arryComing.map((item, index) => {
                        return <option key={index + item}>{item} </option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4 rsvpForm m2">
                  <label htmlFor="">Not Coming</label>
                  <div className="rsvpInput">
                    <select
                      className="form-control"
                      id="notComing"
                      value={this.state.notComing}
                      onChange={this.onSelectConfirmed}
                      name="notComing"
                    >
                      {this.state.arryNotComing.map((item, index) => {
                        return <option key={index + item}>{item} </option>;
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <label htmlFor="">Undecided</label>

                  <div className="Undecided" id="Undecided">
                    <div className="Undecided1">{this.state.numInvited}</div>
                  </div>
                </div>
              </div>
              <br />
              <Button>Submit</Button>
              <br /> <br />
            </Form>
          </div>
          <div className="col-sm-3" />
        </div>

        <Modal
          className="modalm"
          style={{ width: "240px" }}
          isOpen={this.state.returnRsvp}
          toggle={this.toggleSendRsvp}
        >
          <ModalHeader toggle={this.toggle}>
            Do you want to send your rsvp?
          </ModalHeader>
          <ModalFooter className="btnSend">
            <Button
              onClick={this.Submitfunc}
              style={{ backgroundColor: "#560027" }}
            >
              Yes
            </Button>
            <Button onClick={this.toggleSendRsvp} color="secondary">
              No
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Rsvp;
