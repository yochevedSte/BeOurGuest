import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import AddIcon from '@material-ui/icons/Add';
import { observer, inject } from 'mobx-react';

import {
  Button,
  IconButton,
  Icon,
  withStyles,
  TextField,
} from '@material-ui/core';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    fontSize: 12
  },
  addButton: {
    //marginTop: theme.spacing.unit * 8,
    position: 'fixed',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 8,
    zIndex: 10,
    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.71), 0 6px 20px 0 #212121",
    border: 'solid',
  },

  iconEditButton: {
    height: 25,
    width: 25,
    position: "absolute",
    left: 50,
    top: 10,
},
icon: {
  color: theme.palette.primary.main,
  fontSize: 15
},

})


@inject("store")
@observer
class CreateCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalCategory: false,
      name: "",
      _id: "",
      colorCode: "#000000"
    };
  }

  onChangeText = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  toggleCategory = () => {
    this.setState({
      modalCategory: !this.state.modalCategory
    });
  }

  handleClose = () => {
    this.setState({
      name: '',
      colorCode: "#000000",
      modalCategory: false,
    });
  }

  initializeCategory = (category) => {
    this.setState({
      name: category.name,
      colorCode: category.colorCode,
      _id: category._id,
    });
  }
  handlerSaveCategory = (e) => {
    e.preventDefault();
    let userId = this.props.store.user._Id;
    if(this.props.type === "create"){
    axios.post('/beOurGuest/addNewCategory/' + userId, this.state)
      .then(response => {
        // console.log(" new Category ->id  =" + response.data._id)
        this.props.store.addCategory(response.data)
      })
      .catch(err => console.log('Error: ', err));
    }
    else if(this.props.type === "edit"){
      axios.post('/beOurGuest/editCategory/' + userId , this.state)
      .then(response => {
         console.log(response.data);
        this.props.store.editCategory(response.data);
      })
      .catch(err => console.log('Error: ', err));
    }
    this.handleClose();
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.props.type === "edit" &&
          <IconButton className={classes.iconEditButton}>
            <Icon onClick={e => { 
              this.initializeCategory(this.props.category);
              this.toggleCategory();
             }} className={classes.icon}>edit_icon</Icon>
          </IconButton>}
        {this.props.store.myCategoryPage && this.props.type === "create" ?
          <IconButton aria-label="add" style={{ left: "20px" }} className={classes.iconButton} onClick={this.toggleCategory} >
            <AddIcon className={classes.icon} />
          </IconButton> :

          <Button variant="extendedFab" color="secondary" aria-label="Add" onClick={this.toggleCategory} className={classes.addButton}>
            <AddIcon className={classes.addIcon} />
            Add Category
             </Button>}

        <Modal style={{ width: "300px" }} isOpen={this.state.modalCategory} toggle={this.toggleCategory} className="CreateNewCategory">
          <form action="" onSubmit={this.handlerSaveCategory}>
            <ModalHeader toggle={this.toggleCategory}>Category</ModalHeader>
            <ModalBody>
              <TextField
                required
                id="name"
                label="Category Name"
                type="text"
                className={classes.textField}
                value={this.state.name}
                onChange={this.onChangeText}
                name="name"
              />
              <br />
              <label htmlFor="colorCode" style={{ padding: "20px" }}>Select color</label>

              <input type="color" required onChange={this.onChangeText} value={this.state.colorCode} name="colorCode" id="colorCode" />

              <br />
            </ModalBody>
            <ModalFooter>
              <Button size="small" variant="contained" color="secondary" type="Submit" > Save </Button>
              <Button size="small" variant="contained" onClick={this.handleClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  }
}


export default withStyles(styles)(CreateCategory);