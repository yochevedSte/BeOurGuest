import React, { Component } from 'react';
import GuestsList from './GuestsList';


export class GuestManager extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <GuestsList />
            </div>
        );
    }
}

export default GuestManager;