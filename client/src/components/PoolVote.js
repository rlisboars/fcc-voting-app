import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Grid, Container, Form, Button, Select } from 'semantic-ui-react';

import { fetchPool } from '../actions';

class PoolVote extends Component {
    // console.log(this.props.match.params.id);
    componentWillMount() {
        const { id } = this.props.match.params;
        this.props.fetchPool(id);
    }
    render() {
        console.log(this.props.pool);
        if (!this.props.pool && !this.props.error) {
            return(
                <div>Loading...</div>
            );
        }
        if (this.props.error) {
            return(
                <div className="ui raised segment">
                    <h3>{this.props.error}</h3>
                </div>
            );
        }
        return(
            <div>
            <Segment raised>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <h3>{this.props.pool.pool}</h3>
                                <Form>
                                    <Form.Field control={Select} options={
                                        this.props.pool.options.map(opt => {
                                            return({
                                                key: opt._id,
                                                text: opt.option,
                                                value: opt._id
                                            });
                                        })
                                    } placeholder='Choose an option' />
                                    <Form.Field control={Button}>Submit</Form.Field>
                                </Form>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <div id="piechart"></div>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Container textAlign="center" style={{fontSize: "10px"}}>
                Created by {this.props.pool.user.name.split("@")[0]} on {new Date(this.props.pool.createdAt).toLocaleString()}
            </Container>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    if (Object.keys(state.pools).length === 0) {
        return {
            pool: undefined
        };
    } else {
        return {
            pool: state.pools[ownProps.match.params.id],
            error: state.pools.error ? "Invalid pool id" : undefined
        };
    }
}

export default connect(mapStateToProps, { fetchPool })(PoolVote);