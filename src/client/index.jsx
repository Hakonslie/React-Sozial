import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter, Switch, Route} from 'react-router-dom';


import {Home} from "./home";
import Login from "./login";
import SignUp from "./signup";
import HeaderBar from "./headerbar";
import Profile from "./profile";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            userCount: 1
        };
    }
// Websocket generic functionality and counter from web and api course github as stated in disclaimer, but also picked up here:
// https://github.com/arcuri82/web_development_and_api_design/blob/master/les09/chat/websocket-full/src/client/index.jsx

    componentDidMount() {
        this.fetchAndUpdateUserInfo();
        let protocol = "ws:";
        if(window.location.protocol.toLowerCase() === "https:"){
            protocol = "wss:";
        }
        this.socket = new WebSocket(protocol + "//" + window.location.host);
        this.socket.onmessage = ( event => {
            const dto = JSON.parse(event.data);
            if (dto === null || dto === undefined || !dto.userCount) {
                this.setState({userCount: "ERROR"});
                return;
            }
            this.setState({userCount: dto.userCount});
        });
    }

    componentWillUnmount() {
        this.socket.close();
    }

    fetchAndUpdateUserInfo = async () => {
        const url = "/api/user";
        let response;
        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 401) {
            this.updateLoggedInUser(null);
            return;
        }
        if (response.status !== 200) {
        } else {
            const payload = await response.json();
            this.updateLoggedInUser(payload);
        }
    };

    updateLoggedInUser = (user) => {
        this.setState({user: user});
    };

    notFound() {
        return (
            <div>
                <h2>NOT FOUND: 404</h2>
                <p>
                    ERROR: the page you requested in not available.
                </p>
            </div>
        );
    };


    render() {
        const id = this.state.user ? this.state.user.id : null;
        return (
            <BrowserRouter>
                <div>
                    <HeaderBar userId={id}
                               updateLoggedInUser={this.updateLoggedInUser}/>
                    <Switch>
                        <Route exact path="/profile/:profileid"
                               render={props => <Profile {...props}
                                                         userId={id}
                                                         user={this.state.user}
                                                         updateLoggedInUser={this.updateLoggedInUser}
                                                         fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}
                               />}/>
                        <Route exact path="/login"
                               render={props => <Login {...props}
                                                       fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path="/signup"
                               render={props => <SignUp {...props}
                                                        fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route exact path="/"
                               render={props => <Home {...props}
                                                      user={this.state.user}
                                                      userCount={this.state.userCount}
                                                      fetchAndUpdateUserInfo={this.fetchAndUpdateUserInfo}/>}/>
                        <Route component={this.notFound}/>
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));
