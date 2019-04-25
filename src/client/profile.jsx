import React from "react";
import {Link, withRouter} from 'react-router-dom';


export class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profilePageId: props.match.params.profileid,
            errorMsg: null,
            hasBefriendedMe: false,
            isBefriendedByMe: false,
            isMyProfileConfirmed: false,
            editProfileActivated: false,
            awaitingRelations: [],
            posts: undefined
        };
    }

    componentDidMount() {
        this.getProfileInfo();
        this.isMyProfile();
        this.checkFriendship();
    }

    // Have to force the new props into methods in order for page to update with new profile id when Linked to
    componentWillReceiveProps(nextProps) {
        this.setState({profilePageId: nextProps.location.newUser});
        let newUser = nextProps.location.newUser;
        this.getProfileInfo(newUser);
        this.isMyProfile(newUser);
        this.checkFriendship(newUser);

    }
    getProfileInfo = async (newUser) => {

        let newUserForRequest;
        if(! newUser ) newUserForRequest = this.props.match.params.profileid;
        else newUserForRequest = newUser;

        const url = "/api/profile/" + newUserForRequest;
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
            this.props.updateLoggedInUser(null);
            this.props.history.push('/');
            return;
        }

        if (response.status !== 200) {
            this.setState({errorMsg: "Failed connection to server. Status " + response.status});
            return;
        }
        const profile = await response.json();

        this.setState({content: true, profile: profile})

    };
    onPostMessageChange = (event) => {
        this.setState({newPostMessage: event.target.value, errorMsg: null});
    };
    createNewPost = async() => {
        const url = "/api/posts";
        let response;
        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({postMessage: this.state.newPostMessage})
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }
        if (response.status !== 201){
            this.setState({errorMsg: "Failed connection to server. Status " + response.status});
        }
    this.getPosts(this.state.profilePageId);
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
    editProfile = () => {
        if(this.state.editProfileActivated === false) {
            this.setState({
                firstName: this.state.profile.user_name_first,
                lastName: this.state.profile.user_name_last,
                location: this.state.profile.user_location,
                editProfileActivated: true
            });
        }
    };

    doChangeProfile = async () => {
        const url = "/api/user";
        const payload = {userId: this.state.profile.id, firstName: this.state.firstName, lastName: this.state.lastName, location: this.state.location};
        let response;
        try {
            response = await fetch(url, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: "+ err});
            return;
        }
        if(response.status !== 204){
            this.setState({errorMsg: "Error when connecting to server: status code "+ response.status});
            return;
        }
        this.setState({errorMsg: null});
        this.getProfileInfo();
        this.setState({editProfileActivated: false});
    };


    isMyProfile = (newUser) => {

        let newUserForRequest;
        if(! newUser ) newUserForRequest = this.props.match.params.profileid;
        else newUserForRequest = newUser;

        let userId;
        try{
            userId = this.props.userId }
        catch(e) {
            userId = ""
        }
        if(userId === newUserForRequest){
            this.setState({isMyProfileConfirmed: true})
        }
        this.getAwaitingRequests();
        this.getPosts(newUserForRequest);
    };

    addOrRemoveFriend = async () => {
        const url = "/api/user/relations/";

        if(!this.state.isBefriendedByMe) {
            let response;
            try {
                response = await fetch(url, {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userRelationId: this.props.match.params.profileid})
                });
            } catch (err) {
                this.setState({errorMsg: "Failed to connect to server: " + err});
                return;
            }
            if (response.status !== 204) {
                this.setState({errorMsg: "Failed connection to server. Status " + response.status});
                return;
            }

            this.checkFriendship()

        }
        else {

            let response;
            try {
                response = await fetch(url, {
                    method: "delete",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({userRelationId: this.props.match.params.profileid})
                })
            }
                catch(e) {
                    this.setState({errorMsg: "Failed to connect to server: " + err});
                return;
            }
            if (response.status === 400) {
                // Missing user Id
                return;
            }

            if (response.status === 404) {
                //User doesnt exist
                return;
            }

            if (response.status !== 204) {
                this.setState({errorMsg: "Failed connection to server. Status " + response.status});
                return;
            }
            this.checkFriendship()

        }
    };

    checkFriendship = async (newUser) => {

        let newUserForRequest;
        if(! newUser ) newUserForRequest = this.props.match.params.profileid;
        else newUserForRequest = newUser;

      const url = "/api/user/relations/" + newUserForRequest;

        let response;
        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 400) {
            return;
        }
        if (response.status === 404) {
            this.setState({isAFriend: false});
            return;
        }
        if (response.status !== 200) {
            this.setState({errorMsg: "Failed connection to server. Status " + response.status});
            return;
        }
        const isAFriend = await response.json();
        this.setState({isBefriendedByMe: isAFriend.iBefriendedUser, hasBefriendedMe: isAFriend.userHasBefriendedMe});

        if(isAFriend.userHasBefriendedMe) {
            this.getPosts(newUserForRequest);
        }
    };

    getAwaitingRequests = async() => {
        let userId;
        try{
            userId = this.props.user.id }
        catch(e) {
            userId = ""
        }

        if(userId === "") return;

        const url = "/api/user/relations/";
        let response;
        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 400) {
            return;
        }
        if (response.status === 404) {
            return;
        }
        if (response.status !== 200) {
            this.setState({errorMsg: "Failed connection to server. Status " + response.status});
            return;
        }
        const responseJson = await response.json();
        this.setState({awaitingRelations: responseJson.awaitingRelations});
    };

    getPosts = async(newUser) => {

        const url = ('/api/posts/' + newUser);
        let response;
        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 400) {
            return;
        }
        if (response.status === 404) {
            return;
        }
        if (response.status !== 200) {
            this.setState({errorMsg: "Failed connection to server. Status " + response.status});
            return;
        }
        let responseJson =  await response.json();
        this.setState({postsAmount: responseJson.length, posts: responseJson.posts});


    };
    deletePost = async(postId) => {
        const url = ('/api/posts/' + postId);
        let response;
        try {
            response = await fetch(url, {
                method: "delete"
            });
        } catch (err) {
            this.setState({errorMsg: "Failed to connect to server: " + err});
            return;
        }
        if (response.status === 400) {
            return;
        }
        if (response.status === 404) {
            return;
        }
        if (response.status !== 204) {
            this.setState({errorMsg: "Failed connection to server. Status " + response.status});
            return;
        }
        this.getPosts(this.state.profilePageId);

    };

    renderNotLoggedIn = () => {

        return(
            <div>
                Need to log in :)
            </div>
        )

    };

    renderLoggedIn = (userId) => {

        if (this.state.errorMsg) {
            return <h2>ERROR: {this.state.errorMsg}</h2>;
        }

        if (!this.state.content) {
            return <h2>Loading...</h2>;
        }

        if (this.state.editProfileActivated === true) {
            return (
                <table>
                    <tbody>
                    <tr>
                        <td className="leftContent">
                            &nbsp;
                        </td>
                        <td className="centerContent">
                            <h2 className="UserId">{this.state.profile.id}</h2>
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
                            <div className="btn btnSignUp" onClick={this.doChangeProfile} id="signUpBtn">Make changes</div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            )
        }

        if(userId === this.props.match.params.profileid) {
            return (
                <div className="ProfilePage">
                    <table>
                        <tbody>
                        <tr>
                            <td className="leftContent">
                                <h2 className="UserId">{this.state.profile.id}</h2>
                                <ul>
                                    <li>Name: <span className="UserId">{this.state.profile.user_name_first}</span> <span className="UserId">{this.state.profile.user_name_last}</span></li>
                                    <li>From: <span className="UserId">{this.state.profile.user_location}</span></li>
                                </ul>
                                <span className="editProfileClicker" onClick={this.editProfile}>Edit</span>

                                <div className="awaitingRequests">
                                    <h4>Friend requests:</h4>

                                    <ul>
                                        {this.state.awaitingRelations.map(userId => (
                                            <li key={userId}><Link to={{ pathname: '/profile/' + userId, newUser: userId }}>{userId}</Link></li>
                                        ))}
                                    </ul>


                                </div>

                            </td>
                            <td className="centerContent">
                                    <div>
                                        <div>
                                            <textarea className="newPost"
                                                   placeholder="What are you thinking about?"
                                                   value={this.state.newPostMessage}
                                                   onChange={this.onPostMessageChange}
                                            />
                                            <div className="btn newPostBtn"  onClick={this.createNewPost} id="loginBtn">Create post</div>
                                        </div>
                                        {!this.state.posts ? (
                                            <div>

                                                No posts

                                            </div>
                                        ) : (
                                            this.state.posts.sort((function(a, b){return new Date(b.post_date_time) - new Date(a.post_date_time)})).map((value, index) => {

                                                return (

                                                    <div className="postContainer" key={index}>
                                                        <div className="postDelete" onClick={() => this.deletePost(value.id)}> x </div>
                                                        <div className="postMessage">{value.post_message}</div>
                                                        <div className="postTime">{value.post_user_id}, {new Date(value.post_date_time).toDateString()}</div>
                                                    </div>
                                                )
                                            })
                                        )
                                        }
                                    </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            )
        }

        return (
            <div className="ProfilePage">
                <table>
                    <tbody>
                    <tr>
                        <td className="leftContent">
                            <h2 className="UserId">{this.state.profile.id}</h2>
                            <ul>
                                <li>Name: <span className="UserId">{this.state.profile.user_name_first}</span> <span className="UserId">{this.state.profile.user_name_last}</span></li>
                                <li>From: <span className="UserId">{this.state.profile.user_location}</span></li>
                            </ul>
                        </td>
                        <td className="centerContent">
                            {this.state.hasBefriendedMe  ? (

                                <div>
                                    {!this.state.posts ? (
                                        <div>

                                            No posts

                                        </div>
                                    ) : (
                                            this.state.posts.sort((function(a, b){return new Date(b.post_date_time) - new Date(a.post_date_time)})).map((value, index) => {

                                                return (

                                                    <div className="postContainer" key={index}>
                                                        <div className="postMessage">{value.post_message}</div>
                                                        <div className="postTime">{value.post_user_id}, {new Date(value.post_date_time).toDateString()}</div>
                                                    </div>
                                                )
                                            })
                                        )
                                    }
                                </div>

                            ) : (

                                <div>
                                    User has not befriended you. Send a request or wait for confirnation
                                </div>

                            )}
                        </td>
                    </tr>
                    </tbody>
              <tfoot>
                <tr>
                  <td>
                      &nbsp;
                  </td>
                    <td>
                <div>
                    {this.state.isBefriendedByMe ? (
                        <div>
                            You have befriended {this.props.match.params.profileid}, <div className="addOrRemoveFriend" onClick={this.addOrRemoveFriend}>remove friend</div>
                        </div>
                    ) : (
                        <div>
                            You have not befriended {this.props.match.params.profileid}, <div className="addOrRemoveFriend" onClick={this.addOrRemoveFriend}>add friend</div>
                        </div>
                    )}
                </div>
                     </td>
                 </tr>
              </tfoot>
                </table>
            </div>
        );



    };


    render() {
        const userId = this.props.userId;
        let content;
        if (! userId) {
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn(userId);
        }
        return (
            <div>
            {content}
            </div>
        )
    }

}


export default withRouter(Profile);

