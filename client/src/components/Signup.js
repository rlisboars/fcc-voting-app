import React, { Component } from 'react';

class Signup extends Component {
    render() {
        return(
            <div className="ui raised segment">
                <form className="ui form">
                    <div className="field">
                        <label>Email</label>
                        <input type="text" className="form-control" id="emailInput" placeholder="Your email" />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" className="form-control" id="passwordInput" placeholder="Your password" />
                    </div>
                    <div className="ui inverted red segment">
                        <i className="warning circle icon"></i>
                        Wrong password</div>
                    <input type="submit" className="ui button" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Signup;