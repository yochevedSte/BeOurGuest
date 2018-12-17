
import React from 'react';
import SignIn from './/SignIn';
import SignUp from './/SignUp';
import ForgotPassword from './/ForgotPassword';
import { observer, inject } from 'mobx-react';


import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CardBody } from 'reactstrap';
@inject("store")
@observer
class LogIn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: true,
            openLogin: true,
            password: false
        };
        this.toggle = this.toggle.bind(this);
    }

    handlerRegister = () => {
        this.setState({ openLogin: false });
    }
    handlerLogin = () => {
        this.setState({ openLogin: true, password: false });
    }

    forgot_password = () => {
        this.setState({ password: true });
    }
    toggle() {
        this.props.store.openModalLogin();
    }
    render() {
        return (
            <div>
                <Modal className="modalLogin" style={{ top: "100px", width: "350px" }} toggle={this.toggle} isOpen={this.props.store.user.ModalLogin} className={this.props.className}>
                    <div className="maintop">
                        <Button className="btnl " onClick={this.handlerLogin}><i className="fas fa-sign-in-alt"> </i>  Login</Button>
                        <Button className="btnr " onClick={this.handlerRegister}><i className="fas fa-user-plus"></i>  Register</Button>
                    </div>
                    {(this.state.openLogin && !this.state.password) && <SignIn BtnPassword={this.forgot_password} />}
                    {(this.state.openLogin && this.state.password) && <ForgotPassword BtnPassword={this.forgot_password} />}
                    {!this.state.openLogin && <SignUp />}
                </Modal>

            </div>
        );
    }
}

export default LogIn;