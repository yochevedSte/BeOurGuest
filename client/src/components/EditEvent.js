
import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
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
class EditEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Title: "",
            Date: "",
            Location: "",
            maxGuests: "",
            HostName: "",
            // tables: [],
            // invitations: [],
            // guests: [],
            modalEdit: "",

        };
        this.toggle = this.toggle.bind(this);
    }

    onChangeText = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    toggle() {
        this.props.openEditeEvent(this.props.indexEvent)
    }
    handlerEditEven = (e) => {
        this.toggle();
        e.preventDefault();

        axios.post('/beOurGuest/editEvent/' + this.props.store.user.events[this.props.indexEvent]._id, this.state)
            .then(response => {
                // console.log(" edit event   =" + JSON.stringify(response.data))
                this.props.store.editEvent(response.data, this.props.indexEvent)
                this.props.store.ChangeMyEventPage(true)

            }).catch(err => console.log('Error: ', err));
    }

    componentWillReceiveProps() {
        const index = this.props.indexEvent;
        if (index !== null)
            this.setState({
                Title: this.props.store.user.events[index].Title,
                Date: this.props.store.user.events[index].Date,
                Location: this.props.store.user.events[index].Location,
                maxGuests: this.props.store.user.events[index].maxGuests,
                HostName: this.props.store.user.events[index].HostName,
                tables: this.props.store.user.events[index].table,
                invitations: this.props.store.user.events[index].invitations,
                guests: this.props.store.user.events[index].guest
            }, () => {
                this.setState({
                    modalEdit: this.props.modalEdit
                })
            })
    }
    render() {

        return (
            <div>
                <MyModal >

                    <Modal style={{ width: "320px" }} isOpen={this.state.modalEdit} toggle={this.toggle} className="editEvent">
                        <form action="" onSubmit={this.handlerEditEven}>
                            <ModalHeader toggle={this.toggle}>Edit Event</ModalHeader>
                            <ModalBody>
                                <TextField
                                    required
                                    id="Title" label="Title" type="text" className="textField"
                                    name="Title" onChange={this.onChangeText} value={this.state.Title}
                                />
                                <br />
                                <TextField
                                    id="Date" label="Date" type="date" className="textField"
                                    name="Date" onChange={this.onChangeText} value={this.state.Date}
                                />
                                <br />
                                <TextField
                                    id="Location" label="Location" type="text" className="textField"
                                    name="Location" onChange={this.onChangeText} value={this.state.Location}
                                />
                                <br />
                                <TextField
                                    id="maxGuests" label="Max guests" type="number" className="textField"
                                    name="maxGuests" onChange={this.onChangeText} value={this.state.maxGuests}
                                />
                                <br />
                                <TextField
                                    id="HostName" label="Host name" type="text" className="textField"
                                    name="HostName" onChange={this.onChangeText} value={this.state.HostName}
                                />
                                <br />
                            </ModalBody>
                            <ModalFooter style={{ textAlign: "center" }}>
                                <Button size="small" variant="contained" color="secondary" type="Submit" >Edit</Button>
                                <Button size="small" variant="contained" onClick={this.toggle}>Cancel</Button>
                                {/* <Button style={{ backgroundColor: '#560027' }} variant="contained" type="Submit" >Save event</Button>
                                <Button color="secondary" onClick={this.toggle}>Cancel</Button> */}
                            </ModalFooter>
                        </form>
                    </Modal>

                </MyModal>
            </div>
        );
    }
}



export default EditEvent;
