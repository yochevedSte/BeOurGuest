import React, { Component } from 'react';
import '../App.css'
import { Draggable } from 'react-beautiful-dnd';
import { observer, inject } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import { Grid, Paper, Chip, Avatar, IconButton, Tooltip } from '@material-ui/core';

const styles = theme => ({
    guestWrapper: {
        width: 'auto',
        padding: 3,
    },
    paper: {
        height: 140,
        width: 100,
    },

    categoryAvatar: {
        height: 10,
        width: 10,
        marginTop: 5
    },
    iconButton: {
        height: 20,
        width: 20
    },
    icon: {
        height: 15,
        width: 15,

    },
    categoryList: {
        paddingRight: 1,
        paddingTop: 3
    }

});
/* 
const Container = styled.div`
  height: 30px;
  background-color: blue;
  width: 100%;
`;

 */
@inject("store")
@observer
class Guest extends Component {



    render() {
        const { classes, guest } = this.props;
        let currentEvent = this.props.store.user.events[this.props.store.eventIndex];
        return (
            <Draggable draggableId={this.props.guest._id} index={this.props.index}>
                {(provided) => (
                    <div className={classes.guestWrapper}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        {...provided.draggableProps}>
                        <Grid container spacing={0} >
                            <Grid item xs={12}>
                                <Paper>
                                    <Grid container spacing={0} style={{ padding: '0 8px 8px 8px' }}>
                                        <Grid item xs={1} className={classes.categoryList}>
                                            {this.props.guest.categories.map((category, index) => {
                                                let eCategory = this.props.store.user.categories.find(c => c._id === category);
                                                if (!eCategory) {
                                                    eCategory = { colorCode: 'black' }
                                                }
                                                return (<Tooltip key={category._id} title={eCategory.name} ><Avatar key={eCategory._id} className={classes.categoryAvatar}
                                                    style={{ backgroundColor: eCategory.colorCode }} /></Tooltip>
                                                )
                                            }
                                            )}


                                        </Grid>
                                        <Grid item xs={10} style={{ paddingTop: 8 }}>
                                            <Tooltip title={guest.numComing + "/" + (guest.numInvited - guest.numNotComing) + " confirmed"}>
                                                <Chip
                                                    avatar={<Avatar>{guest.numComing}/{guest.numInvited - guest.numNotComing}</Avatar>}
                                                    label={guest.globalGuest_id.name}
                                                    className={classes.chip}
                                                />
                                            </Tooltip>
                                        </Grid>

                                        <Grid item xs={1}>
                                            {this.props.seated &&
                                                <IconButton aria-label="Delete" className={classes.iconButton} onClick={(e) => { this.props.handleOnClick(this.props.index) }} >
                                                    <ClearIcon className={classes.icon} />
                                                </IconButton>
                                            }
                                        </Grid>

                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>

                    </div>
                )}
            </Draggable>
        );
    }
}

export default withStyles(styles)(Guest);