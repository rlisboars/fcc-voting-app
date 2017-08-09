import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { loginUser, logoutUser } from '../actions';

const ROOT_URL = process.env.REACT_APP_API_URL;

class Header extends Component {
    componentWillMount() {
        const user = localStorage.getItem('vote-app-user') ? JSON.parse(localStorage.getItem('vote-app-user')) : null;
        if (user) {
        axios.get(`${ROOT_URL}validate`, { headers: { Authorization : `JWT ${user.token}` } })
                .then(res => {
                    this.props.loginUser(null, null, user);
                })
                .catch(err => {
                    localStorage.removeItem('vote-app-user');
                });
        }
    }
    logout() {
        localStorage.removeItem('vote-app-user');
        this.props.logoutUser();
    }
    render() {
        if (this.props.user) {
            return(
                <div className="ui top menu">
                    <div className="ui container">
                        <div className="item"><Link to="/">Voting app</Link></div>
                        <div className="right menu">
                            <div className="item">
                                <Link to="/create">
                                    <button className="ui labeled icon primary button">
                                        <i className="add icon"></i>
                                            New Pool
                                    </button>
                                </Link>
                            </div>
                            <div className="item">
                               <div className="ui red button" onClick={this.logout.bind(this)}>Logout</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return(
            <div className="ui top menu">
                <div className="ui container">
                    <div className="item"><Link to="/">Voting app</Link></div>
                    <div className="right menu">
                        <div className="item">
                            <Link to="/login"><div className="ui button">Login</div></Link>
                        </div>
                        <div className="item">
                            <Link to="/signup"><div className="ui primary button">Sign up</div></Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user : state.user.user
    };
};

export default connect(mapStateToProps, { loginUser, logoutUser })(Header);