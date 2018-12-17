import React, { Component } from 'react';
import '../App.css'
import Table from './Table';
import Table0 from './Table0';
import AddTableModal from './CreateTablel'
import { observer, inject } from 'mobx-react';
import {
    withStyles,
    Grid,
}
    from '@material-ui/core';

import axios from 'axios';


const styles = theme => ({
    tableListWrapper: {

        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "flex-start",
    },
    tables: {
        flexWrap: 'nowrap',
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
        height: '70vh',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "flex-start",

    }


});

@inject("store")
@observer
class TableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            maxGuests: '',
            category: '',
            anchorEl: null,
        }
    }

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null,
        });
    };
    onChangeText = (e) => {
        e.preventDefault();
        this.setState({ [e.target.name]: e.target.value });

    }
    saveTable = (e) => {
        // console.log("title  " + this.state.title + "    maxGuests " + this.state.maxGuests + "  category " + this.state.category)


        let tableInfo = {
            title: this.state.title,
            maxGuests: this.state.maxGuests,
            category: this.state.category,

        }
        let indexEvent = this.props.store.eventIndex;
        let eventId = this.props.store.user.events[indexEvent]._id
        axios.post(`/beOurGuest/createTable/${eventId}/`, tableInfo)
            .then(response => {
                // console.log((response.data))
                this.props.store.addTable(response.data)
            })
        this.handleClose();
    }

    findInCategories = (categoryId) => {
        let category = this.props.store.user.categories.find(c => c._id === categoryId);
        return this.props.filteredCategories.findIndex(cat => cat === category.name);
    }

    sortByCategory = (a, b) => {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        return 0;
    }

    render() {
        let currentEvent = this.props.store.user.events[this.props.store.eventIndex];
        let sortedTables = currentEvent.tables.slice().sort(this.sortByCategory);
        // console.log(currentEvent.tables)
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        let tableIndex = null;
        return (
            <div style={{ height: '100%' }}>
                <div className={classes.tableListWrapper}>
                    <AddTableModal></AddTableModal>
                    <Table0 index={-1} onlyTables={this.props.onlyTables} filteredCategories={this.props.filteredCategories} />
                    <div className={classes.tables}>
                        {sortedTables
                            .filter(t => {
                                if (this.props.filteredCategories.length == 0) return true;
                                return this.findInCategories(t.category) != -1
                            }
                            )
                            .map((table, index) => {
                                tableIndex = sortedTables.findIndex(eTable => eTable.category === table.category);
                                return (<Table table={table} index={tableIndex} key={table._id} />)
                            }
                            )}
                    </div>
                </div>

            </div>

        );
    }
}


export default withStyles(styles)(TableList);