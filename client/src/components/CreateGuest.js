import React, { Component } from 'react';
import '../App.css'
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';
import PropTypes from 'prop-types';
import axios from 'axios';
import MyModal from './Modal';
import { observer, inject } from 'mobx-react';

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

import CreateCategory from './CreateCategory';

const styles = theme => ({
  container: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    fontSize: 12
  },
  addIcon: {
    marginRight: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },

  addButton: {
    position: 'fixed',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 8,
    zIndex: 10,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.71), 0 6px 20px 0 #212121",
    border: 'solid',
  },
  addCategoryButton: {
    position: 'absolute',
    bottom: theme.spacing.unit * 14,
    right: theme.spacing.unit * 6,
  }
});

@inject("store")
@observer
class CreateGuest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      name: "",
      email: "",
      phone: "",
      category: "",
      categoryName: "",
      invited: 0,
      coming: 0,
      notComing: 0
    };
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
      [event.target.name]: event.target.selectedOptions[0].innerText
    });
  };

  onChangeText = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  handleRemoveGuest = (e) => {
    //console.log(JSON.stringify(itemguest))
    // console.log(("Guest " + e.target.name + " will be deleted"))
    let index = e.target.name;
    let guestId = this.props.store.user.guests[index]._id;
    axios.delete(`/beOurGuest/removeGuest/${this.props.store.user._Id}/${guestId}/`)
      .then(response => {
        // console.log((response.data))
        this.store.removGuest(e.target.name)
      })
  }

  handleSaveGuest = (e) => {
    this.toggle();
    e.preventDefault();
    // console.log(this.props.store.user.UserId)
    axios.post(
      '/beOurGuest/addNewGuest/' + this.props.store.user._Id +
      '/' + this.props.store.user.events[this.props.store.eventIndex]._id,
      this.state)
      .then(response => {
        if (response === null) {
          // console.log("Failed to add new guest!");
        }
        else {
          // console.log("New globalGuest " + response.data.globalGuestId);
          // console.log("New guest " + response.data.guestId);
          this.props.store.addGuest(response.data)
        }
      })
      .catch(err => console.log('Error: ', err));
  }

  categoryListElements = () => {
    this.props.store.user.categories.map((category, index) => {
      return (
        <MenuItem value={index}>{category.name}</MenuItem>
      )
    })
  }

  displayCategoryName = guest => {
    let category = this.props.store.user.categories.find(category => category._id === guest.categories[0]);
    return category.name;
  }

  render() {
    let { classes } = this.props;
    return (
      <div>
        <Button variant="extendedFab" color="secondary" style={{ position: "fixed" }} aria-label="Add" onClick={this.toggle} className={classes.addButton}>
          <AddIcon className={classes.addIcon} />
          Add Guest
        </Button>

        {this.state.modal &&
          <Modal style={{ width: "320px" }} isOpen={this.state.modal} toggle={this.toggle} className="CreateNewguest">
            <form action="" onSubmit={this.handleSaveGuest}>
              <ModalHeader toggle={this.toggle}>Create New Guest</ModalHeader>
              <ModalBody>
                <TextField
                  required
                  id="name" label="Name" type="text" className="textField"
                  name="name" onChange={this.onChangeText} value={this.inputText}
                />
                <br />
                <TextField
                  required
                  id="email" label="Email" type="email" className="textField"
                  name="email" onChange={this.onChangeText} value={this.inputText}
                />
                <br />
                <TextField

                  id="phone" label="Phone" type="text" className="textField"
                  name="phone" onChange={this.onChangeText} value={this.inputText}
                />

                <br />

                <TextField

                  id="invited" label="Invited" inputProps={{ min: "1", max: "10", step: "1" }} type="number" className="textField"
                  name="invited" onChange={this.onChangeText} value={this.inputText}
                  required
                />
                <br />
                <TextField

                  id="coming" label="Coming" type="number" className="textField"
                  name="coming" onChange={this.onChangeText} value={this.inputText}
                />
                <br />
                <TextField
                  id="notComing" label="Not coming" type="number" className="textField"
                  name="notComing" onChange={this.onChangeText} value={this.inputText}
                />
                <FormControl required className={classes.formControl}  >
                  <InputLabel shrink htmlFor="category">category</InputLabel>
                  <div className={classes.container} style={{ width: "170px" }} >
                    <Select

                      required
                      native
                      label="Category"
                      value={this.state.category}
                      id="category"
                      name="categoryName"
                      onChange={this.handleChange} >
                      <option disabled value="" />
                      {this.props.store.user.categories.map((item, index) => {
                        return <option key={item._id} value={item._id} data-name={item.name}>{item.name}</option>
                      })}
                    </Select>
                  </div>
                  <FormHelperText>Select category or create new</FormHelperText>
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button size="small" variant="contained" color="secondary" type="Submit"> Save </Button>
                <Button size="small" variant="contained" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </form>
            <div className={classes.addCategoryButton} >
              <CreateCategory />
            </div>
          </Modal>
        }
      </div>
    );
  }
}


CreateGuest.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateGuest);


// select#category {
//   width: 200px;
// }