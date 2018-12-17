import React, { Component } from 'react';
import Invitation from './Invitation';
import { observer, inject } from 'mobx-react';
import axios from 'axios';
import PropTypes from 'prop-types';


import {
    Icon,
    Button,
    withStyles,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from '@material-ui/core';

const styles = theme => ({
    icon: {
        color:  theme.palette.secondary.main,
        fontSize: 20
    },
    iconButton: {
        height: 35,
        width: 35
    }
});



@inject("store")
@observer
class InvitationManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invitations: [],
            num: 0,
            modal: false,
            modalEmail: false,
            openDialogDeleteInvitation: false,
            opebDialogSend: false,
            modalRemove: false,
            indexInvitations: ""
        }
    }

    myIndex = (e) => {
        e.preventDefault();
        this.props.store.theInvitationIndex(e.target.id)
    }

    removeInvitations = () => {
        let eventIndex = this.props.store.eventIndex;
        let eventId = this.props.store.user.events[eventIndex]._id;
        let index = this.props.store.invitationIndex;

        axios.delete(`/beOurGuest/removeInvitation/${eventId}/${eventIndex}/${index}`)
            .then(response => {
                this.props.store.removeInvitation(index)
            })
        this.toggleDialogInvitation();
        this.props.store.theInvitationIndex(null);

    }
    editInvitations = (e) => {
        e.preventDefault();
        this.props.store.theInvitationIndex(e.target.id)
        this.setState({ num: this.state.num + 1 })
    }
    toggleSend = () => {
        this.setState({
            modal: !this.state.modal
        });
    }
    toggleDialogInvitation = () => {
        this.setState({ openDialogDeleteInvitation: !this.state.openDialogDeleteInvitation });
    };
    toggleDialogSend = () => {
        this.setState({ opebDialogSend: !this.state.opebDialogSend });
    };

    sendInvitations = () => {
        let item = this.props.store
        let e_index = item.eventIndex;
        // let i_Index = e.target.id;
        let i_Index = this.props.store.invitationIndex;
        let event = item.user.events[e_index];
        let vet = event.invitations[i_Index];
        let vetId = vet._id;
        let guestId = "temid"
        let getAllGuest = event.guests
        let invet = event.invitations[i_Index];
        let linkRsvp2 = `http://localhost:3000/beuorguest/rsvp/${vetId}/${event._id}/${guestId}/`

        // let linkRsvp2 = `https://beourguest.herokuapp.com/beuorguest/rsvp/${vetId}/${event._id}/${guestId}/`
        console.log(linkRsvp2)
        axios.post(`/beOurGuest/rsvpEmail/${vetId}/${event._id}/`, invet)
            .then(response => {
                console.log("send all email ")
            })
        this.toggleDialogSend();

    }
    render() {
        const item = this.props.store;
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.state.openDialogDeleteInvitation}
                    onClose={this.toggleDialogInvitation}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-Invitation"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-Invitation">
                            Are you sure you want to remove this invitation?
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.removeInvitations} color="secondary" autoFocus>
                            Remove
            </Button>
                        <Button onClick={this.toggleDialogInvitation}>
                            Cancel
            </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.opebDialogSend}
                    onClose={this.toggleDialogSend}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-send"
                >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-send">
                            Are you sure you want to send an invitation to all your guests?
            </DialogContentText>
                    </DialogContent>
                    <DialogActions>

                        <Button onClick={this.sendInvitations} color="secondary" autoFocus>
                            Send
            </Button>
                        <Button onClick={this.toggleDialogSend} >
                            Cancel
            </Button>
                    </DialogActions>
                </Dialog>

                <div className="row">
                    <div className="col-sm-6">
                        You have {item.user.events[item.eventIndex].invitations.length} invitations
                        <br />
                        <br />
                        <div className="listinvitations" style={{ height: '100%', textAlign: 'center', paddingLeft: 30, paddingRight: 30 }}>
                            {item.user.events[item.eventIndex].invitations.map((vet, index) => {
                                return (
                                    <div className="iteminvitations container">
                                        <div name={index} key={vet.invitationName + index} className="row">

                                            <div className="col-sm-7 text2"
                                                style={{
                                                    paddingLeft: 25,
                                                    display: 'flex',
                                                    justifyContent: 'left', /* align horizontal */
                                                    alignItems: 'center'
                                                }}>{vet.invitationName}</div>
                                            <div className="col-sm-5 btnicon" style={{ textAlign: 'right' }}>
                                                <IconButton className={classes.iconButton}>
                                                    <Icon id={index} onClick={this.editInvitations} className={classes.icon}>edit_icon</Icon>
                                                </IconButton>
                                                <IconButton className={classes.iconButton}>
                                                    <Icon id={index} onClick={e => { this.myIndex(e); this.toggleDialogSend() }} className={classes.icon}>send_icon</Icon>
                                                </IconButton>
                                                <IconButton className={classes.iconButton}>
                                                    <Icon id={index} onClick={e => { this.myIndex(e); this.toggleDialogInvitation() }} className={classes.icon}>clear_icon</Icon>
                                                </IconButton>
                                            </div>
                                        </div>
                                    </div>

                                )
                            })}
                        </div>

                    </div>
                    <div className="col-sm-5">
                        <Invitation num={this.state.num} />
                    </div>
                    <div className="col-sm-1">
                    </div>

                </div>
            </div>



        );
    }
}

InvitationManager.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InvitationManager);

