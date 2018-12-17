import React, { Component } from 'react';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {
  withStyles,
  Grid,
  Paper,
  Typography,
  Icon,
  IconButton,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Tooltip
} from "@material-ui/core";
import CreateCategory from './CreateCategory';
import ClearIcon from "@material-ui/icons/Clear";
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
    border: 'solid',
  },
  tableAvatar: {
    height: 20,
    width: 20,
    color: "black",
    //   borderRadius: 2,
    /*         borderWidth:2,
            borderStyle:'solid', */
    fontSize: 15
  },
  categoriesHeader: {
    color: '#cecccc',

  }
});
@inject("store")
@observer
class CategoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCategory: null,
      categoryIndex: -1,
      openDeleteCategory: false,
      isEmpty: true,
    }
  }
  handleClose = () => {
    this.setState({
      currentCategory: null,
      categoryIndex: -1,
      openDeleteCategory: false
    });
  };

  handleOpenDeleteCategory = () => {
    this.setState({ openDeleteCategory: !this.state.openDeleteCategory });
  };

  handleCloseDeleteCategory = () => {
    this.setState({ openDeleteCategory: !this.state.openDeleteCategory });
  };

  myIndex = (e) => {
    e.preventDefault();
    this.setState({ currentCategory: this.props.store.user.categories[e.target.id], categoryIndex: e.target.id })
  }

  handleDeleteCategory = () => {
    // this.handleCloseDeleteCategory();
    // let currentCategory = this.state.currentCategory;
    // let inUse = false;
    // let currentEventTest = this.props.store.user.events[0].guests[0].categories[0];
    // for (let i = 0; i < this.props.store.user.events.length; i++) {
    //   for (let j = 0; j < this.props.store.user.events[i].guests.length; j++) {
    //     for (let k = 0; k < this.props.store.user.events[i].guests[j].categories.length; k++)
    //       if (this.props.store.user.events[i].guests[j].categories[k] === currentCategory._id) {
    //         inUse = true;
    //         break;
    //       }
    //   }
    // }
    // if (!inUse) {
    //   //app.delete('/beOurGuest/removeCategory/:userId', 
    //   axios.delete("/beOurGuest/removeCategory/${this.props.store.user._Id}" + currentCategory._id)
    //     .then(response => {
    //       // console.log(response);
    //       this.props.store.removeCategory(this.state.categoryIndex)
    //     })
    //     .catch(err => console.log("Error: ", err));
    // }
    // this.handleClose();
  };

  render() {
    const item = this.props.store;
    const { classes } = this.props;
    return (
      <div className="row" style={{overflowY: 'auto', height: '90vh', width: '101%'}}>
        <Dialog
          open={this.state.openDeleteCategory}
          onClose={this.handleCloseDeleteCategory}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to remove this category?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCategory} color="secondary" autoFocus >
              Remove
                        </Button>
            <Button onClick={this.handleCloseDeleteCategory}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <div className="eventPage col-md-4 offset-md-4">
          {this.props.store.user.categories.length == 0 &&
            < h3 className={classes.categoriesHeader}>You have no categories</h3>}
          <div className="myEvent" style={{ margin: 50 }}>
          {this.props.store.user.categories.map((category, index) => {
            return (
              <div className="iteminvitations container" style={{ cursor: 'pointer', width: 'auto', }}>
                <div name={index} key={category._id} className="row text2" id={index}>

                  <div className="col-md-2">
                    <Avatar
                      className={classes.tableAvatar}
                      style={{ backgroundColor: category.colorCode, marginRight: "20px" }}
                    >

                    </Avatar>
                  </div>
                  <div className="col-md-8">
                    {category.name}
                  </div>

                  <div className="col-md-2 btnicon" style={{ textAlign: 'right' }}>
                    <IconButton className={classes.iconButton} >
                      <ClearIcon className={classes.icon} />
                      {/* <Icon id={index} onClick={e => { this.myIndex(e); this.handleOpenDeleteCategory() }} id={index} className={classes.icon}>clear_icon</Icon> */}
                    </IconButton>
                    {/* onClick={this.handleOpenDeleteCategory} <IconButton className={classes.iconButton}>
                                                <Icon id={index} onClick={e => { this.openEditeEvent(e.target.id) }} id={index} className={classes.icon}>edit_icon</Icon>
                                            </IconButton> */}
                    {/* <IconButton className={classes.iconButton}>
                                                <Icon id={index} onClick={e => { this.myIndex(e); this.toggleRemove() }} id={index} className={classes.icon}>clear_icon</Icon>
                                            </IconButton> */}
                  </div>
                </div>
              </div>

            )
          })}
        </div>
      </div>
      <CreateCategory />


        {/* <EditEvent openEditeEvent={this.openEditeEvent}
                    modalEdit={this.state.modalEdit}
                    indexEvent={this.state.myEvent} /> */}
      </div >
    );
  }
}




export default withStyles(styles)(CategoryPage);


//.js