import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Header, Form, Button, Table, Grid, Icon, Message } from 'semantic-ui-react';

import { createPool } from '../actions';

class PoolCreation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            title: "",
            option: "",
            options: [],
            error: "",
            success: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.insertOption = this.insertOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.savePool = this.savePool.bind(this);
    }
    handleChange(event) {
        const target = event.target;
        const name = target.name;
        this.setState({
            [name]: target.value,
            error: "",
            success: ""
        });
    }
    insertOption() {
        const options = _.map(this.state.options, 'option');
        const option = this.state.option.trim();
        if (this.state.option.length === 0) {
            this.setState({
                error: "Invalid option text"
            });
        } else if (_.indexOf(options, option) >= 0) {
            this.setState({
                error: "Option already exists"
            });
        } else {
            const opt = {
                option: this.state.option.trim(),
                user: {
                    _id: this.props.user.id,
                    name: this.props.user.email
                }
            }
            this.setState({
                options: [...this.state.options, opt],
                option: "",
                error: ""
            });
        }
    }
    removeOption(idx, event) {
        var opts = this.state.options.slice();
        opts.splice(idx, 1);
        this.setState({
            options: opts
        });
    }
    savePool(event) {
        event.preventDefault();
        if (this.state.title.trim().length === 0 || this.state.options.length === 0) {
            this.setState({
                error: "Please fill all required data"
            });
        } else {
            this.setState({
                error: ""
            });
            const pool = {
                pool: this.state.title.trim(),
                options: this.state.options
            };
            this.props.createPool(pool, this.props.user.token, (res) => {
                if (res.status === 200) {
                    this.setState({
                        title: "",
                        option: "",
                        options: [],
                        error: "",
                        success: res.data
                    });
                }
            });
        }
    }
    render() {
        if (!localStorage.getItem('vote-app-user')) {
            return(<Redirect to='/login'/>);
        }
        return(
            <Form>
                <Header as='h3'>Create Pool</Header>
                <Form.Input 
                    label='Pool'
                    type='text'
                    name='title'
                    placeholder='Pool text'
                    value={this.state.title}
                    onChange={this.handleChange} 
                />
                <Grid>
                    <Grid.Column width={8}>
                        <Form.Group>
                            <Form.Input 
                                label='Enter an Option'
                                type='text'
                                name='option'
                                placeholder='Enter an option'
                                width={15}
                                value={this.state.option}
                                onChange={this.handleChange}
                                    onKeyPress={evt => {
                                        if (evt.which === 13) {
                                            evt.preventDefault();
                                            this.insertOption();
                                        }
                                    }}
                            />
                            <Button icon='add' size='mini' color='green' onClick={this.insertOption} type="button" style={{marginTop: '22px'}}/>
                        </Form.Group>
                        <Button primary onClick={this.savePool}>Save</Button>
                        { this.state.error.length > 0 &&
                            <Message color='red'>
                                <Icon name='warning circle' />{this.state.error}
                            </Message>
                        }
                        { this.state.success.length > 0 &&
                            <Message color='green'>
                                <Icon name='info circle' />Pool Created! Id <Link to={'/pool/'+this.state.success}>{this.state.success} <Icon name='linkify' /></Link>
                            </Message>
                        }
                    </Grid.Column>
                    <Grid.Column width={8}>
                        <Form.Field>
                            <label>Current Options</label>
                        </Form.Field>
                        <Table style={{marginTop: -10}}>
                            <Table.Body>
                                { this.state.options.length === 0 &&
                                    <Table.Row>
                                        <Table.Cell width={16} textAlign='center'>
                                            Insert an option
                                        </Table.Cell>
                                    </Table.Row>
                                }
                                { this.state.options.map((opt, idx) => {
                                    return(
                                        <Table.Row key={idx}>
                                            <Table.Cell width={15}>{opt.option}</Table.Cell>
                                            <Table.Cell width={1}>
                                                <Button icon='trash' size='mini' color='red' onClick={this.removeOption.bind(this, idx)} type='button' />
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                </Grid>
            </Form>
        );
    }
}

function mapStateToProps(state) {
    return {
        user : state.user.user
    };
}

export default connect(mapStateToProps, { createPool })(PoolCreation);