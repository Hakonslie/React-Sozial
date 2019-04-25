import React from 'react';
import {withRouter} from 'react-router-dom'

export class SignUp extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            userId: "",
            password: "",
            confirm: "",
            firstName: "",
            lastName: "",
            location: "",
            errorMsg: null
        };
        // Functionality for auto-focusing on input field, copied from: https://reactjs.org/docs/react-api.html#reactcreateref
        this.inputRef = React.createRef();
    }

    onUserIdChange = (event) => {
        this.setState({userId: event.target.value, errorMsg: null});
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value, errorMsg: null});
    };

    onConfirmChange = (event) => {
        this.setState({confirm: event.target.value, errorMsg: null});
    };

    onFirstNameChange = (event) => {
        this.setState({firstName: event.target.value, errorMsg: null});
    };

    onLastNameChange = (event) => {
        this.setState({lastName: event.target.value, errorMsg: null});
    };

    onLocationChange = (event) => {
        this.setState({location: event.target.value, errorMsg: null});
    };

    doSignUp = async () => {

        const {userId, password, confirm, firstName, lastName, location} = this.state;

        if(confirm !== password){
            this.setState({errorMsg: "Passwords do not match"});
            return;
        }

        const url = "/api/signup";

        const payload = {userId: userId, password: password, firstName: firstName, lastName: lastName, location: location};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: "+ err});
            return;
        }


        if(response.status === 400){
            this.setState({errorMsg: "Invalid userId/password"});
            return;
        }

        if(response.status !== 201){
            this.setState({errorMsg: "Error when connecting to server: status code "+ response.status});
            return;
        }

        this.setState({errorMsg: null});
        await this.props.fetchAndUpdateUserInfo();
        this.props.history.push('/');
    };
    componentDidMount() {
        this.inputRef.current.focus();
    }

    render(){

        let error = <div></div>;
        if(this.state.errorMsg !== null){
            error = <div className="errorMsg"><p>{this.state.errorMsg}</p></div>
        }

        let confirmMsg = "Ok";
        if(this.state.confirm !== this.state.password){
           confirmMsg = "Passwords Not matching";
        }

        return(
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td className="leftContent">
                            &nbsp;
                        </td>
                        <td className="centerContent">
                <div>
                    <h5>User Id:</h5>
                    <input
                           type="text"
                           value={this.state.userId}
                           onChange={this.onUserIdChange}
                           id="userIdInput"
                           ref={this.inputRef}

                    />
                </div>
                <div>
                    <h5>Password:</h5>
                    <input
                           type="password"
                           value={this.state.password}
                           onChange={this.onPasswordChange}
                           id="passwordInput"
                    />
                </div>
                <div>
                    <h5>Confirm:</h5>
                    <input
                           type="password"
                           value={this.state.confirm}
                           onChange={this.onConfirmChange}
                           id="confirmInput"
                    />
                </div>
                        </td>
                        <td>
                    <div>
                        <h5>First name:</h5>
                        <input type="text"
                               value={this.state.firstName}
                               onChange={this.onFirstNameChange}
                               id="firstNameInput"
                        />
                    </div>
                    <div>
                        <h5>Last name:</h5>
                        <input type="text"
                               value={this.state.lastName}
                               onChange={this.onLastNameChange}
                               id="lastNameInput"
                        />
                    </div>
                    <div>
                        <h5>Location:</h5>
                        <input type="text"
                               value={this.state.location}
                               onChange={this.onLocationChange}
                               id="locationInput"
                        />
                    </div>
                        </td>
                    </tr>
                    <tr>
                        <td className="leftContent">
                            &nbsp;
                        </td>
                        <td className="centerContent">
                            <div className={"errorSignup"}>
                            {confirmMsg}
                            {error}
                            </div>
                            <div className="btn btnSignUp" onClick={this.doSignUp} id="signUpBtn">Register</div>
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );
    }
}

export default withRouter(SignUp);
