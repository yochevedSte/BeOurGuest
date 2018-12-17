import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../App.css'
//import styled from 'styled-components';
//import 'typeface-roboto'
import Guest from './Guest'
import { Droppable } from 'react-beautiful-dnd';
import { observer, inject } from 'mobx-react';
import DeleteIcon from '@material-ui/icons/Delete';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import {
    withStyles,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Typography,
    IconButton,
    Avatar,
    Tooltip,

} from '@material-ui/core';




const styles = theme => ({
    paper: {

    },
    tableWrapper: {
        width: 280,
        minHeight: '70vh',
        margin: 0,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#99919436',
        // backgroundColor: theme.palette.primary.main,
        // transition: width 2s, height 4s;
        // transition: background-color 0.2s ease;
        //backgroundColor: ${ props => (props.isDraggingOver ? '#4A6572' : '#4A6572') }
        // backgroundColor: 
        fontFamily: 'Roboto Slab, serif',
        position: 'relative',
        // justifyContent: '', 
        overflow: 'hidden',
        borderRadius: 5,
        /* borderWidth: 2,
        borderStyle: 'solid',
        borderColor: 'darkgrey', */
       // border: 'solid 2px #a9a9a95e',
      //  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.068), 0 6px 20px 0 rgba(0, 0, 0, 0.11)',
        border: 'solid 3px #eeeeee',
       // backgroundColor: '#999194c9',
        
       // border-radius: 10px;
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.342), 0 6px 20px 0 #2121219c',



    },

    tableHeader: {
        padding: 10,
        color: 'white',
        backgroundColor: theme.palette.secondary.main

    },

    tableAvatar: {
        height: 60,
        width: 60,
        color: 'black',
        marginBottom: 5,

        fontSize: 18

    },

    iconButton: {
        height: 35,
        width: 35,


    },
    icon: {
        height: 20,
        width: 20,

    },

    whiteTypography: {
        color: 'white',
        weight: 100,
        fontSize: 20,
        marginBottom: 0,

    
    },

    guestListWrapper: {
        paddingTop: 5,
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '60vh',
    }


});





@inject("store")
@observer
class Table0 extends Component {

    handleOnClick = (guestIndex) => {

    }

    findInCategories = (guest) => {
        let index = -1;
        for (let i = 0; i < guest.categories.length; i++) {
            let category = this.props.store.user.categories.find(c => c._id === guest.categories[i]);
            let index = this.props.filteredCategories.findIndex(cat => cat === category.name)
            if (index != -1)
                return index;
        }
        return index;
    }

    render() {
        const { classes } = this.props;
        let store = this.props.store;
        let currentEvent = store.user.events[store.eventIndex];
        let unseatedGuests = currentEvent.guests.filter(guest => guest.seated === false);
        let sumTotalInvities = 0;
        let sumNotSeated = 0;

        for (let i = 0; i < currentEvent.guests.length; i++) {
            sumTotalInvities += (currentEvent.guests[i].numInvited - currentEvent.guests[i].numNotComing)
        }
        for (let i = 0; i < unseatedGuests.length; i++) {
            sumNotSeated += (unseatedGuests[i].numInvited - unseatedGuests[i].numNotComing)
        }

        // console.log(currentEvent.guests);
        return (

            <div>

                <Paper className={classes.tableWrapper} >
                    <Paper className={classes.tableHeader} >
                        <Grid container spacing={0}>
                            <Grid item xs={12} align="center">
                                <Typography variant="title" gutterBottom align="center" className={classes.whiteTypography}>
                                    {/*  <Tooltip title="# guests not seated / # guests invited">
                                        <Avatar className={classes.tableAvatar}>
                                            {sumNotSeated}/{sumTotalInvities}
                                        </Avatar>
                                    </Tooltip> */}
                                    {sumNotSeated}/{sumTotalInvities} Unseated Guests
                                        </Typography>

                            </Grid>
                        </Grid>


                    </Paper>
                    <Droppable droppableId={"-1"}>
                        {(provided) => (
                            <div style={{ minHeight: 300 }}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={classes.guestListWrapper}
                            >

                                {currentEvent.guests.slice().filter(guest => guest.seated === false)
                                    .filter(g => {
                                        if (this.props.filteredCategories.length == 0 || this.props.onlyTables) return true;
                                        {/* console.log( this.findInCategories(g)); */ }
                                        return this.findInCategories(g) != -1
                                    }
                                    )
                                    .sort((a, b) => {
                                        if (a.globalGuest_id.name < b.globalGuest_id.name) return -1;
                                        if (a.globalGuest_id.name > b.globalGuest_id.name) return 1;
                                        return 0;
                                    })
                                    .map((guest, index) => (
                                        <Guest key={guest._id} index={index} guest={guest} handleOnClick={this.handleOnClick} seated={false}/>
                                    ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </Paper>
            </div>
        );
    }
}

Table0.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Table0);


