import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, ModalBody, CardBody } from 'reactstrap';
// import ForgotPassword from './components/ForgotPassword';

import { withRouter } from "react-router-dom";
import { observer, inject } from 'mobx-react';
import axios from 'axios';

@inject("store")
@observer
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: "",
            passText: "",
            ForgotPassword: false,
            error: false,
        }
    }
    onChangeText = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    onClickBtn = (e) => {
        this.setState({ error: false })
        e.preventDefault();
        axios.post('/beOurGuest/login', { name: this.state.inputText, pass: this.state.passText })
            .then(response => {
                // console.log(response.data)
                if (response.data !== "") {
                    // console.log("user login  " + JSON.stringify(response.data))
                    this.props.store.updateUser(response.data);
                    this.props.store.openModalLogin();
                    this.props.history.push("/" + this.props.store.user._Id + "/events/");
                    
                } else {
                    this.setState({ error: true })
                }

            }).catch(function (error) { console.log(error); });
        this.setState({ inputText: "", passText: "" });
    }
    forgot_password = () => {
        this.setState({ ForgotPassword: true })
    }

    render() {
        return (
            <div>
                <ModalBody state={{ textAlign: "center" }}>
                    <TextField
                        id="uncontrolled" label="User name" type="text"
                        className="textField" margin="normal"
                        name="inputText"
                        onChange={this.onChangeText} value={this.state.inputText}
                    />
                    <br /> <br />
                    <TextField
                        id="password-input" label="Password"
                        type="password" className="textField" margin="normal"
                        name="passText"
                        onChange={this.onChangeText} value={this.state.passText}
                    />
                    <br /> <br /><br />
                    <Button variant="contained" onClick={this.onClickBtn} style={{ backgroundColor: '#560027' }}>Login  </Button>

                    <div>
                        {this.state.error ? <p >
                            <br />
                            <span style={{ color: "red" }}> User does not exist <i className="fas fa-arrow-down"></i> </span></p> : <p> <br /><br /></p>}
                    </div>

                </ModalBody>
                <CardBody>
                    <div className="pas">
                        <p style={{ textDecoration: "underline", color: "blue" }}>Forgot <a onClick={() => { this.props.BtnPassword() }} className="blue-text">Password ?</a></p>
                    </div>
                    <br /><br />
                </CardBody>
            </div >)
    }
}

export default withRouter(SignIn);