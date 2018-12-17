// Need to delet
import React, { Component } from 'react';
import toRenderProps from 'recompose/toRenderProps';
import withState from 'recompose/withState';
import { observer, inject } from 'mobx-react';
import CreateEvent from './CreateEvent';
import CategoryManager from './CategoryManager';

import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TextField from '@material-ui/core/TextField';

// import classNames from 'classnames';
import {
  withStyles, ClickAwayListener, Typography, Grow, Paper, Popper,
  Divider, MenuItem, MenuList, IconButton, Icon, ExpansionPanel,
  Popover, ExpansionPanelDetails, ExpansionPanelSummary, ListItem, List, ListItemText, Button

} from "@material-ui/core"

import MenuIcon from '@material-ui/icons/Menu';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ClearIcon from '@material-ui/icons/Clear';

const WithState = toRenderProps(withState('anchorEl', 'updateAnchorEl', null));

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  menuButton: {
    // marginLeft: -12,
    // marginRight: 20
  },

  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  paper: {
    width: 300,
  },
  rootList: {
    width: '100%',
    maxWidth: 260,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cancelButton: {
    color: 'white',
    backgroundColor: theme.palette.primary.light,
  }
});

@inject("store")
@observer
class OurMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorMenu: null,
      open: false,
      anchorMenuAccount: null,
      expanded: null,
      modalCreate: false,
      modalCategory: false,
      modalRemove: false,
      modalEdit: false,
      myEvent: ""
    };

    // this.handlerRemoveEvent = this.handlerRemoveEvent.bind(this);
  }
  myIndex = (e) => {
    e.preventDefault();
    console.log(e.target.id)
    this.setState({ myEvent: e.target.id })
    // this.props.store.theInvitationIndex(e.target.id)
  }
  toggleEditeEvent = () => {
    this.setState({
      modalEdit: !this.state.modalEdit
    });
  }
  toggleRemove = () => {
    // this.handleClose(e)
    this.setState({
      modalRemove: !this.state.modalRemove
    });
  }

  openModalCreate = (e) => {
    this.setState({ modalCreate: !this.state.modalCreate });
    this.handleClose(e);
  }
  openModalCategory = (e) => {
    this.setState({ modalCategory: !this.state.modalCategory });
    this.handleClose(e);
  }
  handleClose = event => {
    // if (this.anchorEl.contains(event.target)) {
    //   return;
    // }
    this.setState({ anchorMenu: null, expanded: false });
  };

  handleToggle = event => {
    if (this.props.store.user.userLog)
      this.setState(state => ({ anchorMenu: event.currentTarget }));
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handlerRemoveEvent = (e) => {
    e.preventDefault();
    console.log(e)
    let index = this.state.myEvent;

    let eventId = this.props.store.user.events[index]._id;
    console.log("index  " + index)
    console.log("eventId  " + eventId)
    axios.delete(`/beOurGuest/removEvent/${this.props.store.user._Id}/${eventId}/${index}/`)
      .then(response => {
        console.log((response.data))
        this.props.store.removEvent(index)
      })
    // this.handleClose(e)
    this.props.store.thisEventIndex(null)
    this.toggleRemove();
  }

  handleEdit = (e) => {
    e.preventDefault();
    alert("e.target.id; " + e.target.id);
  }

  handleEvent = (index) => {
    this.props.store.thisEventIndex(index)
  }

  render() {
    const { classes } = this.props;
    const { expanded, anchorMenu } = this.state;
    const open = Boolean(anchorMenu);
    return (
      <div className={classes.root} id="x1">
        <IconButton
          aria-owns={open ? 'render-props-popover' : null}
          aria-haspopup="true"
          variant="contained"
          onClick={this.handleToggle}
          // onClick={event => {
          //   updateAnchorEl(event.currentTarget);
          // }}
          aria-label="Menu"
          className={classes.menuButton}
          color="inherit" >
          <MenuIcon />
        </IconButton>

        <Popover
          id="render-props-popover"
          open={open}
          anchorEl={anchorMenu}
          onClose={this.handleClose}
          // onClose={() => {
          //   updateAnchorEl(null);
          // }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Paper className={classes.paper}>
            <ClickAwayListener onClickAway={this.handleClose}>
              <MenuList>
                <MenuItem onClick={this.openModalCreate} >
                  Create Event
                </MenuItem>
                <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Select Event</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List className={classes.rootList} subheader={<li />}>
                      <ul>
                        {this.props.store.user.events.map((eve, index) => {
                          return <ListItem key={eve.HostName + eve.Location + index}
                            name={index} className="itemEvent" button divider disableGutters>

                            <ListItemText id={index} onClick={(e) => { this.handleEvent(index), this.handleClose(e) }} primary={eve.Title} />

                            <Divider />
                            <IconButton onClick={this.handleClose} className={classes.button} aria-label="Edit">
                              <Icon onClick={e => { this.myIndex(e); this.toggleEditeEvent() }} id={index} >edit_icon</Icon>
                            </IconButton>
                            <IconButton aria-label="Delete" onClick={this.handleClose}>
                              <Icon onClick={e => { this.myIndex(e); this.toggleRemove() }} id={index} >clear_icon</Icon>
                              {/*  <i className="far fa-trash-alt" id={index} style={{ color: "black" }} onClick={e => { this.myIndex(e); this.toggleRemove() }}></i> */}
                            </IconButton>
                          </ListItem>
                        })}
                      </ul>
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <MenuItem onClick={this.handleClose} onClick={this.openModalCategory} >Create category</MenuItem>
                <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>List of Categories</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List className={classes.rootList} subheader={<li />}>
                      <ul>
                        {this.props.store.user.categories.map((item, index) => {
                          return (
                            <ListItem key={item._id}
                              name={index} className="itemcategories" button divider disableGutters>

                              <ListItemText id={index} onClick={(e) => { this.handleClose(e) }} primary={item.name} />

                              <Divider />
                              <IconButton onClick={this.handleClose} className={classes.button} >
                                <i className="fas fa-circle" style={{ color: item.colorCode }}></i>
                              </IconButton>
                            </ListItem>
                          )
                        })}
                      </ul>
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popover>
        <CreateEvent openModalCreate={this.openModalCreate}
          modalCreate={this.state.modalCreate} />      

        <div>
          <Modal className="modalm" style={{ width: "240px" }} isOpen={this.state.modalRemove} >
            <ModalHeader toggle={this.toggleRemove}>Do you want to delete this event?</ModalHeader>
            <ModalFooter className="btnSend" >
              <Button color="secondary" variant="contained" onClick={this.handlerRemoveEvent}>Yes</Button>
              <Button variant="contained" onClick={this.toggleRemove} className={classes.cancelButton}>No</Button>

            </ModalFooter>

          </Modal>
        </div>


        <div>
          <Modal style={{ width: "350px" }} isOpen={this.state.modalEdit} toggle={this.toggleEditeEvent} className="editEvent">
            <ModalHeader toggle={this.toggleEditeEvent}>Edit Event</ModalHeader>
            <ModalBody>
              <TextField
                id="Title" label="Title" type="text" className="textField"
                name="Title" onChange={this.onChangeText} value={this.inputText}
              />
              <br />
              <TextField
                id="Date" label="Date" type="date" className="textField"
                name="Date" onChange={this.onChangeText} value={this.inputText}
                InputLabelProps={{
                  shrink: true,
                }}
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
            <ModalFooter>
              <Button color="secondary" variant="contained" onClick={this.toggleEditeEvent}>Save</Button>
              <Button variant="contained" onClick={this.toggleEditeEvent} className={classes.cancelButton}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div >
    );
  }
}

//export default Navbar;

export default withStyles(styles)(OurMenu);
