import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TextField from '@material-ui/core/TextField';

import axios from 'axios';

import MyModal from './Modal';

import { observer, inject } from 'mobx-react';


@inject("store")
@observer
class CategoryManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            Title: "",
            color: "",
        };
        this.toggle = this.toggle.bind(this);
    }

    onChangeText = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    toggle() {
        this.props.openModalCreate()
    }
    handlerSaveCate = (e) => {
        this.toggle();
        e.preventDefault();
        // console.log(this.props.store.user.UserId)
        axios.post('/beOurGuest/addNewCate/' + this.props.store.user._Id, this.state)
            .then(response => {

                // console.log(" new category id  =" + response.data._id)
                this.props.store.addCategory(response.data)

            })
            .catch(err => console.log('Error: ', err));
    }
    render() {
        return (
            <div>
                <MyModal >
                    <Modal isOpen={this.props.modalCreate} toggle={this.toggle} className="CreateNewCategory">
                        <ModalHeader toggle={this.toggle}>Create New Category</ModalHeader>
                        <ModalBody>
                            <TextField
                                id="Title" label="Title" type="text" className="textField"
                                name="Title" onChange={this.onChangeText} value={this.inputText}
                            />
                            <br />
                            <input className="color" type="color" onChange={this.onChangeText} id="color" value={this.state.color} name="color" />
                            <label htmlFor="background">background</label>
                            <br />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.handlerSaveCate}>Save category</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </MyModal>
            </div>
        );
    }
}


export default CategoryManager;
