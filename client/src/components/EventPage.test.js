import React, { Component } from 'react';
import CreateEvent from './CreateEvent';
import EditEvent from './EditEvent';
import axios from 'axios';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
    withStyles, IconButton, Icon, Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { observer, inject } from 'mobx-react';

const styles = theme => ({
    icon: {
        color: theme.palette.secondary.main,
        fontSize: 20
    },
    iconButton: {
        height: 35,
        width: 35
    },
    addButton: {
        position: 'fixed',
        bottom: theme.spacing.unit * 10,
        right: theme.spacing.unit * 8,
        zIndex: 10,
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.71), 0 6px 20px 0 #212121",
    border:'solid',
    },
});
@inject("store")
@observer
class EventPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalCreate: false,
            modalEdit: false,
            modalRemove: false,
            myEvent: null,
        }

    }
    myIndex = (e) => {
        e.preventDefault();
        // console.log(e.target.id)
        // this.props.store.thisEventIndex(e.target.id)

        this.setState({ myEvent: e.target.id })

    }
    handleEvent = (index) => {
        this.props.store.thisEventIndex(index)
        this.props.store.ChangeMyEventPage(true)
        this.props.store.ChangeMyCategoryPage(true)
        this.props.store.currentPageChange("");
    }
    openModalCreate = (e) => {
        this.setState({ modalCreate: !this.state.modalCreate });
        // this.handleClose(e);
    }
    openEditeEvent = (index) => {
        // console.log(index)
        this.setState({ myEvent: index }, () => {
            this.setState({ modalEdit: !this.state.modalEdit })
        });
    }
    toggleRemove = () => {
        // this.handleClose(e)
        this.setState({
            modalRemove: !this.state.modalRemove
        });
    }
    handlerRemoveEvent = (e) => {
        e.preventDefault();
        // console.log(e)
        let index = this.state.myEvent;

        let eventId = this.props.store.user.events[index]._id;
        // console.log("index  " + index)
        // console.log("eventId  " + eventId)
        this.setState({ myEvent: null })

        axios.delete(`/beOurGuest/removEvent/${this.props.store.user._Id}/${eventId}/${index}/`)
            .then(response => {
                // console.log((response.data))

                this.props.store.thisEventIndex(null);
                this.props.store.removEvent(index);

            })
        // this.handleClose(e)
        this.props.store.thisEventIndex(null)
        this.toggleRemove();
    }
    render() {
        const item = this.props.store;
        const { classes } = this.props;
        return (
            <div className="row">
                <Button variant="extendedFab" color="secondary" aria-label="Add" onClick={this.openModalCreate} className={classes.addButton}>
                    <AddIcon className={classes.addIcon} />
                    Add Event
                    </Button>
                <div className="col-sm-4"></div>
                <div className="eventPage col-sm-4">
                    <br />
                    <br />
                    <br />
                    <div>


                    </div>
                    {/*    <div className="addEvent">
                        <Button type="button" style={{ backgroundColor: '#560027', borderRadius: "20px", height: "49px" }} className="AddEvent" onClick={this.openModalCreate} >Add Event</Button>
                    </div> */}
                    <div className="myEvent">
                        {this.props.store.user.events.map((eve, index) => {
                            return (
                                <div className="iteminvitations eventItem clickableItem container" style={{ cursor: 'pointer' }}>
                                    <div name={index} key={eve.HostName + eve.Location + index} className="row">
                                        <div className="col-sm-7 text2"
                                            id={index} onClick={(e) => { this.handleEvent(index) }}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center', /* align horizontal */
                                                alignItems: 'center'
                                            }}>
                                            {eve.Title}
                                        </div>
                                        <div className="col-sm-5 btnicon" style={{ textAlign: 'right' }}>
                                            <IconButton className={classes.iconButton}>
                                                <Icon id={index} onClick={e => { this.openEditeEvent(e.target.id) }} id={index} className={classes.icon}>edit_icon</Icon>
                                            </IconButton>
                                            <IconButton className={classes.iconButton}>
                                                <Icon id={index} onClick={e => { this.myIndex(e); this.toggleRemove() }} id={index} className={classes.icon}>clear_icon</Icon>
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <CreateEvent openModalCreate={this.openModalCreate}
                    modalCreate={this.state.modalCreate} />
                {/* <Modal className="modalm" style={{ width: "240px" }} isOpen={this.state.modalRemove} >
                    <ModalHeader toggle={this.toggleRemove}>Do you want to delete this event?</ModalHeader>
                    <ModalFooter className="btnSend" >
                        <Button color="secondary" variant="contained" onClick={this.handlerRemoveEvent}>Yes</Button>
                        <Button variant="contained" onClick={this.toggleRemove} className={classes.cancelButton}>No</Button>

                    </ModalFooter>

                </Modal> */}

                <div className="removdelog">
                    <Dialog
                        open={this.state.modalRemove}
                        onClose={this.toggleRemove}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-Invitation"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-Invitation">
                                Are you sure you want to remove this event?
            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handlerRemoveEvent} color="secondary" autoFocus>
                                Remove
            </Button>
                            <Button onClick={this.toggleRemove}>
                                Cancel
            </Button>
                        </DialogActions>
                    </Dialog>
                </div>


                <EditEvent openEditeEvent={this.openEditeEvent}
                    modalEdit={this.state.modalEdit}
                    indexEvent={this.state.myEvent} />




            </div>
        );
    }
}




export default withStyles(styles)(EventPage);

