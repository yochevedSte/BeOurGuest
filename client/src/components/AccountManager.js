
import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { withStyles, MenuItem, Menu, IconButton } from "@material-ui/core"

import AccountCircle from '@material-ui/icons/AccountCircle';
import LogIn from './LogIn';
import YouLoginAs from './YouLoginAs';
import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';



const styles = theme => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'flex-end',
    },
});
@inject("store")
@observer
class AccountManager extends Component {
    state = {
        anchorMenu: null,
        open: false,
        anchorMenuAccount: null,
        expanded: null,
        profileModal: false,
    };

    openMyEventPage = () => {
        this.props.store.currentPageChange("events");
        console.log(this.props.store.currentPage);
        this.props.store.thisEventIndex(null)
        console.log(this.props.store.eventIndex);
        console.log(this.props.store.user.userLog);
        this.props.store.ChangeMyEventPage(false)
        this.props.store.ChangeMyCategoryPage(true)
        this.handleCloseMenuAccount();
        this.props.history.push("/" + this.props.store.user._Id + "/events/");
        
        
      }

    openMyCategoryPage = () => {
        this.props.store.currentPageChange("categories");
        this.props.store.thisEventIndex(null)
        this.props.store.ChangeMyCategoryPage(false)
        this.props.store.ChangeMyEventPage(true);
        this.handleCloseMenuAccount();
        this.props.history.push("/" + this.props.store.user._Id + "/categories/");
    }

    handleMenuAccount = event => {
        if (this.props.store.user.userLog)
            this.setState({ anchorMenuAccount: event.currentTarget });
        else
            this.props.store.openModalLogin();

    };

    handleCloseMenuAccount = () => {
        this.setState({ anchorMenuAccount: null, expanded: false });
        this.props.store.currentPageChange("");

    };

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };
    handleLogout = (e) => {
        this.props.store.LogoutUser();
        this.handleCloseMenuAccount();
        this.props.store.thisEventIndex(null)
        this.props.store.ChangeMyEventPage(true)
        localStorage.clear();
        this.props.history.push("/");

    }
    openProfile = (e) => {
        this.setState({
            profileModal: !this.state.profileModal,
        })
        this.handleCloseMenuAccount();
    }

    render() {
        const { classes } = this.props;
        const { anchorMenu, open, anchorMenuAccount, expanded } = this.state;
        const openMenu = Boolean(anchorMenu);
        const openMenuAccount = Boolean(anchorMenuAccount);
        const openEvent = Boolean(expanded);
        return (
            <div className={classes.root} >
                {(this.props.store.user.userLog) ? <YouLoginAs /> : false}
                <IconButton
                    aria-owns={openMenuAccount ? "menuAccount-appbar" : null}
                    aria-haspopup="true"
                    onClick={this.handleMenuAccount}
                    className={classes.menuAccountButton}
                    aria-label="Menu"
                    color="inherit">
                    <AccountCircle />
                </IconButton>
                <LogIn />

                <Menu
                    id="menuAccount-appbar"
                    anchorEl={anchorMenuAccount}
                    anchorOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right"
                    }}
                    open={openMenuAccount}
                    onClose={this.handleCloseMenuAccount}
                >
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                    <MenuItem onClick={this.openProfile}>Profile</MenuItem>
                    <MenuItem onClick={this.openMyEventPage}>My Events</MenuItem>
                    <MenuItem onClick={this.openMyCategoryPage} >My Categories</MenuItem>
                </Menu>
                <Modal className="modalm smallModal" style={{ width: "350px" }} isOpen={this.state.profileModal} toggle={this.openProfile} >
                    <ModalHeader toggle={this.openProfile} ><h3 style={{ textAlign: "center" }}> Profile</h3>
                        <br />
                        <h5 className="far fa-user">  User Name:    {this.props.store.user.username}</h5>
                        <br /><br />
                        <h5 className="far fa-envelope">  Email:    {this.props.store.user.email}</h5>
                        <br /><br />
                    </ModalHeader>
                    <br />
                </Modal>
            </div>
        );
    }
}

//export default Navbar;

export default withRouter(withStyles(styles)(AccountManager));

