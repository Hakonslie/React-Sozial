import React from "react";
import {Link} from "react-router-dom";


export class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            usersForSearchBar: [],
            searchResult: [],
            filtered: []
        };
        this.inputRef = React.createRef();

    }

    componentDidMount() {
        if(this.props.user) {
            this.props.fetchAndUpdateUserInfo();
        }
        this.getPosts();
        this.getUsersForSearchBar();
    }
    componentDidUpdate() {
    }

    getPosts = async() => {
        const url = ('/api/posts');
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
    getUsersForSearchBar = async() => {
        console.log('getting users');
        const url = ('/api/users');
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
        let responseJson = await response.json();

        this.setState({usersForSearchBar: responseJson.users, filtered: responseJson.users});
    };

    //  NOT MADE BY ME: From: https://dev.to/iam_timsmith/lets-build-a-search-bar-in-react-120j

    handleChange = (e) => {
        if(this.state.usersForSearchBar.length === 0) {
            this.getUsersForSearchBar()
        }
        else {
        let currentList = [];
        let newList = [];
        if (e.target.value !== "") {
            currentList = this.state.usersForSearchBar;

            newList = currentList.filter(item => {
                const lc = item.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter);
            });
        } else {
            newList = this.state.usersForSearchBar;
        }
        this.setState({
            filtered: newList
        });
        }
    };



    render() {
        const user = this.props.user;
        const loggedIn = user !== null && user !== undefined;

        return (
            <div>
                <table>
                    <tbody>
                {loggedIn ? (
                    <tr>
                    <td className="leftContent">
                        <input type="text"
                               className="searchBar"
                               ref={this.inputRef}
                               onChange={this.handleChange}
                               placeholder="Search for users..." />

                        <ul className="searchResults">
                            {this.state.filtered.map(item => (
                                <li key={item}><Link className="searchResult" to={"/profile/" + item}>{item}</Link></li>
                            ))}
                        </ul>

                    </td>
                    <td className="centerContent">
                        {
                            this.state.posts !== undefined ? (
                                this.state.posts.sort((function(a, b){return new Date(b.post_date_time) - new Date(a.post_date_time)})).map((value, index) => {

                                        return (

                                            <div className="postContainer" key={index}>
                                                <div className="postMessage">{value.post_message}</div>
                                                <div className="postAuthor"><Link to={"/profile/" + value.post_user_id}>{value.post_user_id}</Link></div>
                                                <div className="postTime">{new Date(value.post_date_time).toDateString()}</div>
                                            </div>
                                        )
                                    }
                                )) : (
                                    <div>
                                        No posts
                                    </div>
                                )

                        }
                    </td>
                    </tr>
                ) : (
                    <tr>
                    <td className="centerContent frontPage">
                    <div>
                        <h5>Welcome to Sozial</h5>
                        <p>
                            Social media for everyone on your own server. All posts are private so you won't see anything before you log in.
                            Have fun!
                        </p>

                        <p>
                            You need to log in!
                         </p>
                    </div>
                    </td>
                    </tr>
                ) }

                    </tbody>
                    <tfoot>
                    <tr>
                        <td className="letContent">&nbsp;
                        </td>
                        <td className="centerContent">
                            <div className="onlineCounter">
                                Number of users online: {this.props.userCount}
                            </div>
                        </td>
                    </tr>

                    </tfoot>
                </table>
            </div>

        );
    }
}
