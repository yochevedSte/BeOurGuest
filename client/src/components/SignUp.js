import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import { Button, ModalBody } from 'reactstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import { observer, inject } from 'mobx-react';
import { withRouter } from "react-router-dom";

@inject("store")
@observer
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputText: "",
            emailText: "",
            passText: "",
            passConfirm: "",
            loading: false,
            Registration: false,
            userSituation: "",
            result: false

        }
    }
    onChangeText = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    onClickBtn = (e) => {
        e.preventDefault();
        if (this.state.passText === this.state.passConfirm) {
            this.setState({ loading: true, Registration: true })

            axios.post('/beOurGuest/newUser', this.state)
                .then(response => {
                    this.setState({ loading: false });
                    // console.log(response.data)
                    if (response.data === "user") {
                        this.setState({ userSituation: "Username already registered" })
                        // console.log("Username already registered")
                    }
                    else if (response.data === "email") {
                        this.setState({ userSituation: "The email address is already registered" })
                        // console.log("The email address is already registered")
                    }
                    else {
                        this.setState({
                            result: true,
                            userSituation: "Registration successful"
                        })
                        this.props.store.updateUser(response.data);
                        this.props.store.openModalLogin();
                        this.props.history.push("/" + this.props.store.user._Id + "/events/");
                       
                        
                    }


                })
            this.setState({
                inputText: "",
                emailText: "",
                passText: "",
                passConfirm: "",
            })
        }
        else
            alert("Your passwords do not match")
    }
    successSignUp = () => {
        return <Button onClick={() => {    this.props.store.openModalLogin();
            this.props.history.push("/" + this.props.store.user._Id + "/events/");}} color="primary" >Enter  </Button>
    }
    failedSignUp = () => {
        return <Button onClick={() => { this.setState({ Registration: false, userSituation: "" }) }} color="primary" >Back</Button>
    }

    BtnChange = (e) => {
        this.props.ChangeOptions();
    }
    render() {
        // const { classes } = this.props;

        return (
            <div>

                {!this.state.Registration && <form action="" onSubmit={this.onClickBtn}>
                    <ModalBody state={{ textAlign: "center" }}>

                        <TextField
                            minLength={6}
                            id="User" label="User name" type="text"
                            className="textField" margin="normal"
                            name="inputText"
                            required

                            onChange={this.onChangeText} value={this.state.inputText}
                        />
                        <br />
                        <TextField
                            required
                            id="emil" label="Email" type="email"
                            className="textField" margin="normal"
                            name="emailText"
                            onChange={this.onChangeText} value={this.state.emailText}
                        />
                        <br />
                        <TextField
                            id="password-input" label="Password"
                            required
                            type="password" className="textField" margin="normal"
                            name="passText"
                            onChange={this.onChangeText} value={this.state.passText}
                        />
                        <br />
                        <TextField
                            id="passConfirm" label="Confirm" required
                            type="password" className="textField" margin="normal"
                            name="passConfirm"
                            onChange={this.onChangeText} value={this.state.passConfirm}
                        />
                        <br /><br />
                        <Button variant="contained" type="Submit" style={{ backgroundColor: '#560027' }}>Register  </Button>
                        <br /><br />
                    </ModalBody>
                </form>}

                {this.state.Registration && <div className="Registration">
                    <br /><br />
                    {this.state.loading && <CircularProgress size={80} />}
                    {!this.state.loading && <div >
                        {this.state.userSituation}
                        <br />
                        <br />
                        {this.state.result ? this.successSignUp() : this.failedSignUp()}
                    </div>}

                    <br /><br /> <br />
                </div>}


            </div>
        );
    }
}

export default withRouter(SignUp);
