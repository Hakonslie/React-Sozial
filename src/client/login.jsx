import React from 'react';
import {Link, withRouter} from 'react-router-dom';


export class Login extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            userId: "",
            password: "",
            errorMsg: null
        };

        // Functionality for auto-focusing on input field, copied from: https://reactjs.org/docs/react-api.html#reactcreateref
        this.inputRef = React.createRef();
    }

    onUserIdChange = (event) =>{
        this.setState({userId: event.target.value});
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value});
    };

    doLogIn = async () => {
        const {userId, password} = this.state;
        const url = "/api/login";
        const payload = {userId: userId, password: password};
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


        if(response.status === 401){
            this.setState({errorMsg: "Invalid userId/password"});
            return;
        }

        if(response.status !== 204){
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
                    <input type="text"
                           value={this.state.userId}
                           onChange={this.onUserIdChange}
                           id="userIdInput"
                           ref={this.inputRef}
                    />
                </div>
                <div>
                    <h5>Password:</h5>
                    <input type="password"
                           value={this.state.password}
                           onChange={this.onPasswordChange}
                           id="passwordInput"
                    />
                </div>

                {error}

                <div className="btn"  onClick={this.doLogIn} id="loginBtn">Log In</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>);
    }
}

export default withRouter(Login);
