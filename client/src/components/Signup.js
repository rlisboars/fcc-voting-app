import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LocalForm, Control } from 'react-redux-form';
import { Segment, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router';

import { userSignUp } from '../actions';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: undefined
        }
    }
     handleSubmit(values) {
        this.setState({
            error: undefined
        });
        const reg = /^[\w.]+@\w+.\w+.{0,1}\w*$/;
        if (!values.email || !values.pass) {
            this.setState({
                error: ["Please fill all fields"]
            });
        } else {
            if (!reg.test(values.email)) {
                this.setState({
                    error: ["Invalid email address"]
                });
            } else {
                this.props.userSignUp(values.email, values.pass);
            }
        }
    }

    getErrors() {
        if (this.props.error) {
            return(
                <div>
                    <i className="warning circle icon"></i>
                    {this.props.error}
                </div>
            );
        }
    }
    render() {
        if (this.props.user) {
            localStorage.setItem('vote-app-user', JSON.stringify(this.props.user));
            return(<Redirect to='/'/>);
        }

        return(
            <Segment raised>
                <LocalForm 
                    className="ui form"
                    onSubmit={(values) => this.handleSubmit(values)}>
                    <div className="field">
                        <label>Email</label>
                        <Control.text model=".email" className="form-control" id="emailInput" placeholder="Your email" />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <Control.text type="password" model=".pass" className="form-control" id="passwordInput" placeholder="Your password" />
                    </div>
                    { (this.state.error || this.props.error) &&
                        <div className="ui inverted red segment">
                        { this.state.error && this.state.error.map((err, idx) => {
                            return(
                            <div key={idx}>
                            <i className="warning circle icon"></i>
                                {err}
                            </div>);
                        })}
                        {this.getErrors()}
                        </div>
                    }
                    <Button type="submit" value="Submit">Sign Up</Button>
                </LocalForm>
            </Segment>
        );
    }
}


function mapStateToProps(state) {
    return {
        user : state.user.user,
        error: state.user.error ? JSON.parse(state.user.error).error : undefined
    };
};

export default connect(mapStateToProps, { userSignUp })(Signup);