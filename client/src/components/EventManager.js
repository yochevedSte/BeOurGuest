import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { observer, inject } from 'mobx-react';
import GuestInfo from './GuestInfo';
import TableManager from './TableManager';
import InvitationManager from './InvitationManager';

//tabs desgin
function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding:  '10px 24px 10px 24px' }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    height: '100%'
  },
  button: {
    // margin: theme.spacing.unit,
    // minWidth: 160,
    fontSize: 13,
    color: theme.palette.common.white,
    '&:hover': {
      border: "1px solid white",
      '& $marked': {
        opacity: 0,
      },
    },
  },
});

@inject("store")
@observer
class EventManager extends React.Component {
  constructor(props){
    super(props);
    if(props.store.eventIndex === null){
      let eventId = props.match.params.eventId;
      let eventIndex = props.store.user.events.findIndex(event => event._id === eventId);
      this.props.store.thisEventIndex(eventIndex);

    }
    
  }
  state = {
    value: 'one',
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };



  render() {
    const { classes, match } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <AppBar className="AppBar" position="static">
              <Tabs className="tabs"
                value={this.state.value}
                onChange={this.handleChange}
                indicatorColor="lightgrey"
                textColor="lightgrey"

                fullWidth>
                <Tab className={classes.button} value="one" label="Guests" />
                <Tab className={classes.button} value="two" label="Tables" />
                <Tab className={classes.button} value="three" label="Invitations" />
              </Tabs>
            </AppBar>
          </div>
        </div>

        {value === 'one' && <TabContainer><GuestInfo /></TabContainer>}
        {value === 'two' && <TabContainer><TableManager /></TabContainer>}
        {value === 'three' && <TabContainer><InvitationManager /></TabContainer>}
      </div>
    );
  }
}

EventManager.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventManager);