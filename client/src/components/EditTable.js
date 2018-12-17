import React, { Component } from 'react';
import toRenderProps from 'recompose/toRenderProps';
import withState from 'recompose/withState';
import { observer, inject } from 'mobx-react';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import {
  Divider,
  Popover,
  withStyles,
  IconButton,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  TextField,

} from '@material-ui/core';

const WithState = toRenderProps(withState('anchorEl', 'updateAnchorEl', null));

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    fontSize: 15
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  typography: {
    margin: theme.spacing.unit * 2,
  },
  iconButton: {
    height: 20,
    width: 20,
  },
  icon: {
    height: 15,
    width: 15,
  },
});

@inject("store")
@observer
class EditTableModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
      tableName: this.props.table.title,
      tableSize: this.props.table.maxGuests,
      categories: [],
      category: this.props.table.category,
      display: "",
      Guests: [],
    }
  }

  handleToggle = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({
      open: false,
      anchorEl: null
    });
  }

  handleTextChange = event => {
    this.setState({ [event.target.id]: event.target.value })
  }

  onChangeCategory = e => {
    this.setState({ category: e.target.value });
    let myCategory = this.props.store.user.categories.find(category => category._id === e.target.value);
    this.setState({ display: myCategory.name });
  }

  editTable = e => {
    e.preventDefault();
    let tableInfo = {
      _id: this.props.table._id,
      title: this.state.tableName,
      maxGuests: this.state.tableSize,
      category: this.state.category,
    }
    axios.post('/beOurGuest/updateTable/', tableInfo)
      .then(response => {
        this.props.store.updateTableById(response.data);
      })
      .catch(err => console.log('Error: ', err));
    this.handleClose();
  }
  componentWillUpdate() {
    let myCategory = this.props.store.user.categories.find(category => category._id === this.props.table.category);
    let categoryName = myCategory.name;
    let display;
    if (this.state.display == "") {
      display = categoryName;
      this.setState({ display })
    }
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? 'render-props-popover' : null}
          aria-haspopup="true"
          variant="contained"
          onClick={this.handleToggle}
          // onClick={event => {
          //   updateAnchorEl(event.currentTarget);
          // }}
          aria-label="Edit" className={classes.iconButton}>
          <EditIcon className={classes.icon} />
        </IconButton>
        <Popover
          id="render-props-popover"
          open={open}
          anchorEl={anchorEl}
          onClose={this.handleClose}
          // onClose={() => {
          //   updateAnchorEl(null);
          // }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <DialogTitle>Edit Table</DialogTitle>
          <Divider></Divider>
          <DialogContent>
            <form className={classes.container} noValidate autoComplete="off" align="center">
              <FormControl required className={classes.formControl} align="left">
                <InputLabel shrink htmlFor="category">Select category</InputLabel>
                <Select
                  label="Category"
                  value={this.state.category}
                  renderValue={value => `${this.state.display}`}
                  onChange={this.onChangeCategory}
                  inputProps={{
                    name: 'category',
                    id: 'category',
                  }}
                  autoWidth >
                  {this.props.store.user.categories.map((item, index) => {
                    return <MenuItem value={item._id} key={item._id}>{item.name}</MenuItem>
                  })}
                </Select>
              </FormControl>
              <TextField
                required
                id="tableName"
                label="Table name"
                type="text"
                className={classes.textField}
                placeholder="Enter table name"
                defaultValue={this.props.table.title}
                value={this.state.tableName}
                onChange={this.handleTextChange}
                margin="normal" />
              <TextField
                id="tableSize"
                label="Max number of guests"
                type="number"
                required
                defaultValue={this.props.table.maxGuests}
                value={this.state.tableSize}
                placeholder="Enter number of places"
                onChange={this.handleTextChange}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal" />
            </form>
          </DialogContent>
          <Divider></Divider>
          <DialogActions>
            <Button size="small" variant="contained" color="secondary" onClick={this.editTable} > Save </Button>
            <Button size="small" variant="contained" onClick={this.handleClose}>Cancel</Button>
          </DialogActions>
        </Popover >
      </React.Fragment >
    );
  }

}

export default withStyles(styles)(EditTableModal);
