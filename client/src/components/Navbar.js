import React, { Component } from 'react';
import {
    AppBar,
    withStyles,
    Toolbar,
} from "@material-ui/core"   //AccountManager

import OurMenu from './OurMenu';
import DropdownEvent from './DropdownEvent';

import AccountManager from './AccountManager';

import { observer, inject } from 'mobx-react';

const styles = theme => ({
    root: {
        flexGrow: 0,
       // zIndex:10,
    },
    menu: {
        flexGrow: 1,
    },

    menuButton: {
        flexGrow: 1,

    },



});

@inject("store")
@observer
class Navbar extends Component {
    state = {
        anchorMenu: null,
        open: false,
        anchorMenuAccount: null,
        expanded: null,
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }
        this.setState({ open: false, expanded: false });
    };

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleMenuAccount = event => {
        this.setState({ anchorMenuAccount: event.currentTarget });

    };

    handleCloseMenuAccount = () => {
        this.setState({ anchorMenuAccount: null, expanded: false });
    };

    handleChange = panel => (event, expanded) => {
        this.setState({
            expanded: expanded ? panel : false,
        });
    };



    render() {
        const { classes } = this.props;
        const { anchorMenu, anchorMenuAccount, expanded } = this.state;
        return (

            <div className={classes.root} >
                <AppBar position="static">
                    <Toolbar className={classes.menu}>
                        {this.props.store.user.userLog && <DropdownEvent />}
                        <AccountManager className={classes.account} />
                    </Toolbar>
                </AppBar>
            </div>


        );
    }
}

//export default Navbar;

export default withStyles(styles)(Navbar);
