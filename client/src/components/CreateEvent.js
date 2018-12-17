
import React, { Component } from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
    Button,
    withStyles,
    MenuItem,
    TextField,
    Select,
    InputLabel,
    FormHelperText,
    FormControl,
  } from '@material-ui/core';
import axios from 'axios';
import MyModal from './Modal';

import { observer, inject } from 'mobx-react';


@inject("store")
@observer
class CreateEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            Title: "",
            Date: "",
            Location: "",
            maxGuests: "",
            HostName: ""
        };
        this.toggle = this.toggle.bind(this);
    }

    onChangeText = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    toggle() {
        this.props.openModalCreate()
    }
    handlerSaveEven = (e) => {
        this.toggle();
        e.preventDefault();
        axios.post('/beOurGuest/addNewEvent/' + this.props.store.user._Id, this.state)
            .then(response => {

                // console.log(" new event id  =" + response.data._id)
                this.props.store.ChangeMyEventPage(true)
                this.props.store.addEvent(response.data)



            }).catch(err => console.log('Error: ', err));
    }
    render() {
        return (
            <div>
                <MyModal >

                    <Modal style={{ width: "320px" }} isOpen={this.props.modalCreate} toggle={this.toggle} className="CreateNewEvent">
                        <form action="" onSubmit={this.handlerSaveEven}>
                            <ModalHeader toggle={this.toggle}>Create New Event</ModalHeader>
                            <ModalBody>
                                <TextField
                                    required
                                    id="Title" label="Title" type="text" className="textField"
                                    name="Title" onChange={this.onChangeText} value={this.state.Title}
                                />
                                <br />
                                <TextField
                                    id="Date" label="Date" type="date" className="textField"
                                    name="Date" onChange={this.onChangeText} value={this.inputText}
                                />
                                <br />
                                <TextField
                                    id="Location" label="Location" type="text" className="textField"
                                    name="Location" onChange={this.onChangeText} value={this.inputText}
                                />
                                <br />
                                <TextField
                                    id="maxGuests" label="Max guests" type="number" className="textField"
                                    name="maxGuests" onChange={this.onChangeText} value={this.inputText}
                                />
                                <br />
                                <TextField
                                    id="HostName" label="Host name" type="text" className="textField"
                                    name="HostName" onChange={this.onChangeText} value={this.inputText}
                                />
                                <br />
                            </ModalBody>
                            <ModalFooter style={{ textAlign: "center" }}>
                                <Button  size="small" variant="contained" color="secondary" type="Submit" >Save</Button>
                                <Button size="small" variant="contained" onClick={this.toggle}>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </Modal>

                </MyModal>
            </div>
        );
    }
}


export default CreateEvent;
