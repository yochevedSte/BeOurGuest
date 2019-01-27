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
        color: theme.palette.primary.main,
        fontSize: 15
    },
    iconClearButton: {
        height: 25,
        width: 25,
        position: "absolute",
        right: 25,
        top: 10,
    },
    iconEditButton: {
        height: 25,
        width: 25,
        position: "absolute",
        left: 50,
        top: 10,
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

    },
    category: {
        borderRadius: "50%",
        width: 120,
        height: 120,
        textAlign: "center",
        lineHeight: "120px",
        margin: 10,
        position: "relative",
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.342), 0 6px 20px 0 #21212140',
    },
    text: {
        fontSize: 20,
        fontWeight: 400,
        lineHeight: "1em",
        verticalAlign: "middle",
        display: "inline-block",
        paddingLeft: 5,
        paddingRight: 5,

    },
    categoriesContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
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
        this.handleCloseDeleteCategory();
        let currentCategory = this.state.currentCategory;
        let inUse = false;
        let currentEventTest = this.props.store.user.events[0].guests[0].categories[0];
        for (let i = 0; i < this.props.store.user.events.length; i++) {
          for (let j = 0; j < this.props.store.user.events[i].guests.length; j++) {
            for (let k = 0; k < this.props.store.user.events[i].guests[j].categories.length; k++)
              if (this.props.store.user.events[i].guests[j].categories[k] === currentCategory._id) {
                inUse = true;
                break;
              }
          }
        }
        if (!inUse) {
            console.log(currentCategory._id);
          //app.delete('/beOurGuest/removeCategory/:userId)', 
          axios.delete(`/beOurGuest/removeCategory/${this.props.store.user._Id}/${currentCategory._id}`)
            .then(response => {
              console.log(response);
              this.props.store.removeCategory(currentCategory._id)
            })
            .catch(err => console.log("Error: ", err));
        }
        this.handleClose();
    };

    render() {
        const item = this.props.store;
        const { classes } = this.props;
        return (
            <div className="row" style={{ overflowY: 'auto', height: '90vh', width: '101%' }}>
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

                <div className="col-md-8 offset-md-2">
                    {this.props.store.user.categories.length == 0 &&
                        < h3 className={classes.categoriesHeader}>You have no categories</h3>}
                    <div className={classes.categoriesContainer} style={{ margin: 50 }}>
                        {this.props.store.user.categories.map((category, index) => {
                            let inUse = false;
                            for (let i = 0; i < this.props.store.user.events.length; i++) {
                                for (let j = 0; j < this.props.store.user.events[i].guests.length; j++) {
                                  for (let k = 0; k < this.props.store.user.events[i].guests[j].categories.length; k++)
                                    if (this.props.store.user.events[i].guests[j].categories[k] === category._id) {
                                      inUse = true;
                                      break;
                                    }
                                }
                              }
                            return (
                                <div key={category._id} className={classes.category} style={{ backgroundColor: category.colorCode }}>

                                  <CreateCategory type="edit" category={category}/>
                                    {!inUse &&
                                    <IconButton className={classes.iconClearButton}>
                                        <Icon id={index} onClick={e => {  this.myIndex(e); this.handleOpenDeleteCategory();  }} className={classes.icon}>clear_icon</Icon>
                                    </IconButton>}
                                    <span className={classes.text}>{category.name}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <CreateCategory type="create"/>


                {/* <EditEvent openEditeEvent={this.openEditeEvent}
                    modalEdit={this.state.modalEdit}
                    indexEvent={this.state.myEvent} /> */}
            </div >
        );
    }
}




export default withStyles(styles)(CategoryPage);