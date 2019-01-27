import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import CreateGuest from './CreateGuest.js';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CreateCategory from './CreateCategory';

import {
  Button,
  TextField,
  Select,
  InputLabel,
  FormHelperText,
  FormControl,
  Input,
  Chip,
  MenuItem,
  FormControlLabel,
  Checkbox
} from '@material-ui/core';
import {
  withStyles,
  Paper,
  IconButton,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table
} from "@material-ui/core";
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 1000,

  },
  iconButton: {
    height: 35,
    width: 35,


  },
  icon: {
    height: 20,
    width: 20,

  },
  guestsContainer: {
    height: "90vh",
    overflowY: "auto",
  },

  formControl: {
    margin: theme.spacing.unit,
   
    minHeight: 75,
    flexDirection:'row',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  formControlLabel: {
    color: 'white',
    paddingLeft: 30,
  },
  checkbox: {
    width: 30,
    marginLeft: 10
  },
  divider: {
    marginBottom: 20
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },

  },
};


@inject("store")
@observer
class GuestInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalCreate: false,
      endpoint: "http://127.0.0.1:3001",
      modelEdit: false,
      name: [],
      checked: false,
      viewedGuests: props.store.user.events[this.props.store.eventIndex].guests,
    };
  }

  openModalCreate = (e) => {
    this.setState({ modalCreate: !this.state.modalCreate });
  }

  handleRemoveGuest = (e, index) => {
    e.preventDefault();
    let guestId = this.props.store.user.events[this.props.store.eventIndex].guests[index]._id;
    let eventId = this.props.store.user.events[this.props.store.eventIndex]._id;
    axios.delete(
      '/beOurGuest/removeGuest/' + eventId + '/' + guestId + '/' + index)
      .then(response => {
        // console.log((response.data));
        this.props.store.removeGuest(index);
        if (response.data != null) {
          this.props.store.updateTableById(response.data);
        }
      })
  }

  handleEdit = (e, index) => {
    e.preventDefault();
    const myGuest = this.props.store.user.events[this.props.store.eventIndex].guests[index];

    this.setState({
      index_guest: index,
      name_g: myGuest.globalGuest_id.name,
      email_g: myGuest.globalGuest_id.email,
      phone_g: myGuest.globalGuest_id.phone,
      category_g: myGuest.categories[0],
      // categoryName: this.props.store.user.guests[index].categoryName,
      invited_g: myGuest.numInvited,
      coming_g: myGuest.numComing,
      notComing_g: myGuest.numComing,
      seated: myGuest.seated
    }, () => {

      this.setState({
        modelEdit: !this.state.modelEdit
      })
    })
  }
  toggle = () => {
    this.setState({
      modelEdit: !this.state.modelEdit
    })

  }
  handleSaveChangeGuest = (e) => {
    e.preventDefault();
    const objGuest = {
      globalGuest: {
        name: this.state.name_g,
        email: this.state.email_g,
        phone: this.state.phone_g,
      },
      categories: this.state.category_g,
      numInvited: this.state.invited_g,
      numComing: this.state.coming_g,
      numNotComing: this.state.notComing_g,
    }
    const GustId = this.props.store.user.events[this.props.store.eventIndex].guests[this.state.index_guest]._id;
    const GlobalGuestId = this.props.store.user.events[this.props.store.eventIndex].guests[this.state.index_guest].globalGuest_id._id;


    axios.post(
      '/beOurGuest/handleSaveChangeGuest/' + GustId + '/' + GlobalGuestId, objGuest)
      .then(response => {
        this.toggle()

        if (response === null) {

          console.log("null")

        }
        else {
          this.props.store.handleSaveChangeGuest(this.state.index_guest, objGuest)
        }
      })
      .catch(err => console.log('Error: ', err));

  }

  onChangeText = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  createData = (id, name, email, phone, coming, undecided, notComing) => {
    return { id, name, email, phone, coming, undecided, notComing };
  }

  rowData = (guest, index) => {
    return (
      this.createData(index, guest.name, guest.email, guest.phone, guest.coming, guest.undecided, guest.notComing)
    )
  };

  displayCategoryName = guest => {
    let categoryInfo = this.props.store.user.categories.find(category =>
      category._id === guest.categories[0]);
    return categoryInfo.name;
  }

  handleChangeCategory = event => {
    this.setState({ name: event.target.value });
  };

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {

    let { classes, theme } = this.props;
    let guests = this.props.store.user.events[this.props.store.eventIndex].guests.slice().sort((a, b) => {
      console.log(a);
      console.log(b);
      if(a.globalGuest_id.name < b.globalGuest_id.name) { return -1; }
      if(a.globalGuest_id.name > b.globalGuest_id.name) { return 1; }
      return 0;});
    if (this.state.name.length != 0) {
      guests = guests.filter(guest => { return this.state.name.indexOf(this.displayCategoryName(guest)) != -1; });
    }

    if(this.state.checked === true){
      guests = guests.filter(guest => guest.numComing > 0);
    }

    let sumComing =0 , sumNotComing = 0, sumUndecided = 0;
    return (
      <div className={classes.guestsContainer}>
        <div className="addGuest" style={{ textAlign: 'center' }}>
          <CreateGuest
            openModalCreate={this.openModalCreate}
            modalCreate={this.state.modalCreate}
          />
        </div>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Filter by Categories</InputLabel>
          <Select
            multiple
            value={this.state.name}
            onChange={this.handleChangeCategory}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => (
                  <Chip key={value} label={value} className={classes.chip} />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
            style={{width:300}}
          >
            {this.props.store.user.categories.map(name => {
              return (
                <MenuItem
                  key={name._id}
                  value={name.name}
                  style={{
                    fontWeight:
                      this.state.name.indexOf(name.name) === -1
                        ? 400
                        : 600,
                    backgroundColor:
                      this.state.name.indexOf(name.name) === -1
                        ? "white"
                        : "lightgrey",

                  }}
                >
                  {name.name}
                </MenuItem>
              )
            })}
          </Select>

           <FormControlLabel
                className={classes.formControlLabel}

                control={
                  <Checkbox
                    checked={this.state.checked}
                    onChange={this.handleChangeCheckbox('checked')}
                    value="checked"
                    className={classes.checkbox}
                  />
                }
                label="Only view RSVP Guests"
              />

        </FormControl>
        {/*  <FormControlLabel
                className={classes.formControlLabel}

                control={
                  <Checkbox
                    checked={this.state.checked}
                    onChange={this.handleChangeCheckbox('checked')}
                    value="checked"
                    className={classes.checkbox}
                  />
                }
                label="Only filter tables"
              /> */}
        <Paper className={this.props.classes.root}>
          <Table className={this.props.classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Category</TableCell>
                <TableCell numeric>Coming</TableCell>
                <TableCell numeric>Not coming</TableCell>
                <TableCell numeric>Undecided</TableCell>
                {/* <TableCell>Comment</TableCell> */}
                <TableCell>Edit/Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guests.map((guest, index) => {
                sumComing += guest.numComing;
                sumNotComing +=  guest.numNotComing;
                sumUndecided += guest.numInvited - guest.numComing - guest.numNotComing;
                return (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {guest.globalGuest_id.name}
                    </TableCell>
                    <TableCell>{guest.globalGuest_id.email}</TableCell>
                    <TableCell>{guest.globalGuest_id.phone}</TableCell>
                    <TableCell>{this.displayCategoryName(guest)}</TableCell>
                    <TableCell numeric>{guest.numComing}</TableCell>
                    <TableCell numeric>{guest.numNotComing}</TableCell>
                    <TableCell numeric>{guest.numInvited - guest.numComing - guest.numNotComing}</TableCell>
                    {/* <TableCell>{guest.comment}</TableCell> */}
                    <TableCell>
                      <IconButton aria-label="Edit" className={classes.iconButton} onClick={(e) => this.handleEdit(e, index)}>
                        <EditIcon className={classes.icon} />
                      </IconButton>
                      <IconButton aria-label="Delete" className={classes.iconButton} onClick={(e) => this.handleRemoveGuest(e, index)} >
                        <ClearIcon className={classes.icon} />
                      </IconButton>

                    </TableCell>
                  </TableRow>
                );
              })}

              <TableRow style={{paddingTop: 10, paddingBottom:10}} >
                    <TableCell component="th" scope="row" style={{fontWeight: "bold"}}>
                   TOTAL
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell numeric style={{fontWeight: "bold"}}>{sumComing}</TableCell>
                    <TableCell numeric style={{fontWeight: "bold"}}>{sumNotComing}</TableCell>
                    <TableCell numeric style={{fontWeight: "bold"}}>{sumUndecided}</TableCell>
                   
                  </TableRow>
            </TableBody>
          </Table>
        </Paper>
        <Modal style={{ width: "320px" }} isOpen={this.state.modelEdit} toggle={this.toggle} className="CreateNewguest">
          <form action="" onSubmit={this.handleSaveChangeGuest}>
            <ModalHeader toggle={this.toggle}>Create New Guest</ModalHeader>
            <ModalBody>
              <TextField
                required
                id="name" label="Name" type="text" className="textField"
                name="name_g" onChange={this.onChangeText} value={this.state.name_g}
              />
              <br />
              <TextField
                required
                id="email" label="Email" type="email" className="textField"
                name="email_g" onChange={this.onChangeText} value={this.state.email_g}
              />
              <br />
              <TextField

                id="phone" label="Phone" type="text" className="textField"
                name="phone_g" onChange={this.onChangeText} value={this.state.phone_g}
              />

              <br />

              <TextField

                id="invited" label="Invited" inputProps={{ min: "1", max: "10", step: "1" }} type="number" className="textField"
                name="invited_g" onChange={this.onChangeText} value={this.state.invited_g}
                required
              />
              <br />
              <TextField

                id="coming" label="Coming" type="number" className="textField"
                name="coming_g" onChange={this.onChangeText} value={this.state.coming_g}
              />
              <br />
              <TextField
                id="notComing" label="Not coming" type="number" className="textField"
                name="notComing_g" onChange={this.onChangeText} value={this.state.notComing_g}
              />
              <FormControl required className={classes.formControl}  >
                <InputLabel shrink htmlFor="category">category</InputLabel>
                <div className={classes.container} style={{ width: "170px" }} >
                  <Select

                    required
                    native
                    label="Category"
                    value={this.state.category_g}
                    id="category"
                    name="category_g"
                    onChange={this.onChangeText} >
                    <option disabled value="" />
                    {this.props.store.user.categories.map((item, index) => {
                      return <option key={item._id} value={item._id} data-name={item.name}>{item.name}</option>
                    })}
                  </Select>
                  <CreateCategory type="create" />
                </div>
                <FormHelperText>Select category or create new</FormHelperText>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button size="small" variant="contained" color="secondary" type="Submit"> Edit </Button>
              <Button size="small" variant="contained" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
}

GuestInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GuestInfo);
