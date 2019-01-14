import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableList from './TableList';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Input,
  InputLabel,
  MenuItem,
  FormControl,
  FormControlLabel,
  Select,
  ListItemText,
  Chip,
  Checkbox,
  Divider

} from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { observer, inject } from 'mobx-react';
import axios from 'axios';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100%"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 300,
    maxWidth: 500,
    minHeight: 75,
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
  },
  checkbox: {
    width: 30,
    marginLeft: 10
  },
  divider: {
    marginBottom: 20
  }
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
export class TableManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: [],
      checked: false
    };
  }

  unseatedToSeated = (result, currentEvent) => {
    const destinationIndex = currentEvent.tables.findIndex(table => table._id === result.destination.droppableId);

    let finish = currentEvent.tables[destinationIndex];
    /*  let unseatedGuests = currentEvent.guests.filter(guest => guest.seated === false);
     let myGuest = unseatedGuests[result.source.index]; */

    /* let guestSourceIndex = currentEvent.guests.findIndex(guest => guest._id === myGuest._id); */
    let newGuests = Array.from(currentEvent.guests);
    let myGuest = newGuests.find(guest => guest._id === result.draggableId);
    myGuest.seated = true;


    const finishGuests = Array.from(finish.guests);
    finishGuests.splice(result.destination.index, 0, myGuest._id);
    const newDestinationTable = {
      ...finish,
      guests: finishGuests
    }

    this.props.store.updateGuests(newGuests);
    this.props.store.updateTable(newDestinationTable, destinationIndex);
    axios.post('/beOurGuest/updateGuestsInTable/', newDestinationTable)
      .then(response => {
        // console.log(response);
      }).then(res => {
        axios.post('/beOurGuest/updateEventGuest/', myGuest)
          .then(res1 => {
            // console.log(res1);
          });
      })
      .catch(err => console.log('Error: ', err));
  }


  seatedToUnseated = (result, currentEvent) => {
    const sourceIndex = currentEvent.tables.findIndex(table => table._id === result.source.droppableId);
    let start = Object.assign(currentEvent.tables[sourceIndex]);
    const newGuests = Array.from(start.guests);
    let myGuest = newGuests.splice(result.source.index, 1);
    start.guests = newGuests;
    let index = currentEvent.guests.findIndex(guest => myGuest[0] === guest._id);
    let eventGuests = Array.from(currentEvent.guests);
    eventGuests[index].seated = false;



    this.props.store.updateTable(start, sourceIndex);
    this.props.store.updateGuests(eventGuests);

    axios.post('/beOurGuest/updateGuestsInTable/', start)
      .then(response => {
        // console.log(response);
      }).then(res => {
        axios.post('/beOurGuest/updateEventGuest/', eventGuests[index])
          .then(res1 => {
            console.log(res1);
          });
      })
      .catch(err => console.log('Error: ', err));

  }

  stayInTable = (result, currentEvent, sourceIndex, start, finish) => {
    const newGuests = Array.from(start.guests);
    let myGuest = newGuests.splice(result.source.index, 1);
    newGuests.splice(result.destination.index, 0, myGuest[0]);


    const newTable = {
      ...start,
      guests: newGuests
    };

    let newTables = Array.from(currentEvent.tables);
    newTables[sourceIndex] = newTable;

    this.props.store.updateTable(newTable, sourceIndex);
    axios.post('/beOurGuest/updateGuestsInTable/', newTable)
      .then(response => {
        // console.log(response);
      })
      .catch(err => console.log('Error: ', err));
  }

  tableToTable = (result, currentEvent, sourceIndex, destinationIndex, start, finish) => {
    const startGuests = Array.from(start.guests);
    let myGuest = startGuests.splice(result.source.index, 1);
    const newStart = {
      ...start,
      guests: startGuests
    }

    const finishGuests = Array.from(finish.guests);
    finishGuests.splice(result.destination.index, 0, myGuest[0]);
    const newFinish = {
      ...finish,
      guests: finishGuests
    }

    let newTables = Array.from(currentEvent.tables);
    newTables[sourceIndex] = newStart;
    newTables[destinationIndex] = newFinish;

    axios.post('/beOurGuest/updateGuestsInTable/', newStart)
      .then(response => {
        // console.log(response);
      }).then(res => {
        axios.post('/beOurGuest/updateGuestsInTable/', newFinish)
          .then(res1 => {
            // console.log(res1);
          });
      })
      .catch(err => console.log('Error: ', err));
    this.props.store.updateTables(newTables);
  }

  onDragEnd = result => {
    let currentEvent = this.props.store.user.events[this.props.store.eventIndex];

    if (result.destination === null)
      return;

    if ((result.destination.droppableId === result.source.droppableId &&
      result.destination.index === result.source.index) ||
      (result.source.droppableId === "-1" && result.destination.droppableId === "-1")) {
      return;
    }



    //from table0 to table
    if (result.source.droppableId === "-1") {
      this.unseatedToSeated(result, currentEvent);
      return;
    }

    //from table to table0
    if (result.destination.droppableId === "-1") {
      this.seatedToUnseated(result, currentEvent);
      return;
    }

    //MOVING BETWEEN TABLES
    const sourceIndex = currentEvent.tables.findIndex(table => table._id === result.source.droppableId);
    const destinationIndex = currentEvent.tables.findIndex(table => table._id === result.destination.droppableId);

    const start = currentEvent.tables[sourceIndex];
    const finish = currentEvent.tables[destinationIndex];

    //Moving within a table
    if (start === finish) {
      this.stayInTable(result, currentEvent, sourceIndex, start, finish);
      return;
    }

    //moving from one table to another
    this.tableToTable(result, currentEvent, sourceIndex, destinationIndex, start, finish);

  }

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  handleChangeCheckbox = name => event => {
    this.setState({ [name]: event.target.checked });

  };

  render() {

    const { classes, theme } = this.props;
    const categories = this.props.store.user.categories;

    return (

      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="container">
          <div className="row">
            <div className="col-sm-6 offset-md-3 " >
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="select-multiple-chip">Filter by Categories</InputLabel>
                <Select
                  multiple
                  value={this.state.name}
                  onChange={this.handleChange}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={selected => (
                    <div className={classes.chips}>
                      {selected.map(value => (
                        <Chip key={value} label={value} className={classes.chip} />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {categories.map(name => (
                    <MenuItem
                      key={name._id}
                      value={name.name}
                      style={{
                        fontWeight:
                          this.state.name.indexOf(name.name) === -1
                            ? theme.typography.fontWeightRegular
                            : theme.typography.fontWeightMedium,
                      }}
                    >
                      {name.name}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>
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
                label="Only filter tables"
              />


            </div>

          </div>

        </div>
        <Divider className={classes.divider} />

        <TableList filteredCategories={this.state.name} onlyTables={this.state.checked} />
      </DragDropContext>



    );
  }
}

TableManager.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TableManager);