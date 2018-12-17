import React, { Component } from 'react';
import '../App.css'
import { observer, inject } from 'mobx-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CreateCategory from './CreateCategory'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  withStyles,
  Divider,
  TextField,
  Select,
  InputLabel,
  FormHelperText,
  FormControl,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import DeleteIcon from "@material-ui/icons/Delete";

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
    border:'solid',
  },
  addCategoryButton: {
    position: 'absolute',
    bottom: theme.spacing.unit * 14,
    right: theme.spacing.unit * 6,
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

@inject("store")
@observer
class AddTableModal extends Component {
  constructor() {
    super();
    this.state = {
      tableName: '',
      tableSize: '',
      categories: [],
      Guests: [],
      category: "",
      open: false,
      modal: false,
    }
  }
  toggle = () => {
    this.setState({
      modal: !this.state.modal
      //, open: !this.state.open
    });
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      tableName: '',
      tableSize: "",
      category: '',
      categories: [],
      Guests: [],
      open: false,
      modal: false,
    });
  };

  handleTextChange = event => {
    this.setState({ [event.target.id]: event.target.value })
  }

  onChangeCategory = e => {
    this.setState({ category: e.target.value });
    if(this.state.tableName === "" || this.state.tableName === " "){
    let category = this.props.store.user.categories.find(category => category._id === e.target.value);
    this.setState({ tableName: category.name });
    }
  }

  addTable = (e) => {
    e.preventDefault();
    let store = this.props.store;
    let tableInfo = {
      title: this.state.tableName,
      maxGuests: this.state.tableSize,
      category: this.state.category,
    }

    axios.post('/beOurGuest/addTable/' + store.user.events[store.eventIndex]._id, tableInfo)
      .then(response => {
        this.props.store.addTable(response.data);
      })
      .catch(err => console.log('Error: ', err));
    this.toggle();
    this.handleClose();
  }

  dialogChildren = () => {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description">
          <DialogTitle id="alert-dialog-slide-title">
            Create new table
                </DialogTitle>
          <Divider></Divider>
          <form className={classes.container} action="" onSubmit={this.addTable}>
            <DialogContent>
              <FormControl style={{ width: "180px" }} required className={classes.formControl}>
                <InputLabel shrink htmlFor="category">Select category</InputLabel>
                <Select
                  required
                  native
                  label="Category"
                  value={this.state.category}
                  onChange={this.onChangeCategory}
                  inputProps={{
                    name: 'categoryName',
                    id: 'category',
                  }}      >
                  <option disabled value="" />
                  {this.props.store.user.categories.map((item) => {
                    return <option key={item._id} value={item._id} data-name={item.name}>{item.name}</option>
                  })}
                </Select>
              </FormControl>
              <TextField
                required
                id="tableName"
                label="Table name"
                type="text"
                className={classes.textField}
                value={this.state.tableName}
                placeholder="Enter table name"
                onChange={this.handleTextChange}
                margin="normal" />
              <TextField
                id="tableSize"
                label="Max number of guests"
                type="number"
                required
                inputProps={{ min: "4", max: "20", step: "1" }}
                value={this.state.tableSize}
                placeholder="Enter number of places"
                onChange={this.handleTextChange}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal" />
            </DialogContent >
            <Divider></Divider>
            <DialogActions>
              <Button size="small" variant="outlined" color="secondary" onClick={this.handleClose}>Cancel</Button>
              <Button size="small" variant="outlined" color="primary" type="Submit"> Save </Button>
            </DialogActions>
          </form >
        </Dialog >
      </React.Fragment >
    );
  }
  modalAddTable = () => {
    const { classes } = this.props;
    return (
      <Modal style={{ width: "320px" }} isOpen={this.state.modal} toggle={this.toggle} className="CreateNewguest">
        <form action="" onSubmit={this.addTable}>
          <ModalHeader toggle={this.toggle}>Create New table</ModalHeader>
          <ModalBody>

            <TextField
              id="tableSize"
              label="Max number of guests"
              type="number"
              required
              inputProps={{ min: "1", step: "1" }}
              value={this.state.tableSize}
              onChange={this.handleTextChange}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal" />
            <TextField
              required
              id="tableName"
              label="Table name"
              type="text"
              className={classes.textField}
              value={this.state.tableName}
              placeholder="Enter table name"
              onChange={this.handleTextChange}
              margin="normal" />
            <FormControl required className={classes.formControl}>
              <InputLabel shrink htmlFor="category">category</InputLabel>
              <div className={classes.container} >
                <Select
                  required
                  native
                  label="Category"
                  value={this.state.category}
                  id="category"
                  name="categoryName"
                  onChange={this.onChangeCategory} >
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
            <Button size="small" variant="contained" onClick={this.handleClose}>Cancel</Button>
            {/* <Button color="primary" type="Submit">Save </Button>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button> */}
          </ModalFooter>
        </form>
        <div className={classes.addCategoryButton} >
          <CreateCategory />
        </div>
      </Modal>
    )
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div>
          <Button variant="extendedFab" color="secondary" aria-label="Add" onClick={this.toggle} className={classes.addButton}>
            <AddIcon className={classes.addIcon} />
            Add Table
                    </Button>

        </div>
        {/* {this.dialogChildren()} */}
        {this.modalAddTable()}
      </div>
    );
  }
}

export default withStyles(styles)(AddTableModal);
