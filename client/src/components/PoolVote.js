import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Segment, Grid, Container, Form } from 'semantic-ui-react';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';

import { fetchPool, vote } from '../actions';

const chartColors = ["#3366CC","#DC3912","#FF9900","#109618","#990099","#3B3EAC","#0099C6","#DD4477","#66AA00",
"#B82E2E","#316395","#994499","#22AA99","#AAAA11","#6633CC","#E67300","#8B0707",
"#329262","#5574A6","#3B3EAC"]

class PoolVote extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: ""
        };
    }
    componentWillMount() {
        const { id } = this.props.match.params;
        this.props.fetchPool(id);
    }
    getChartData() {
        if (this.props.pool) {
            const data = this.props.pool.options.map(opt => {
                return({
                    name: opt.option,
                    value: opt.votes
                });
            });
            return data;
        } 
    }
    handleChange(evt, option) {
        this.setState({
            option: option.value
        })
    }
    handleSubmit() {
        this.props.vote(this.props.pool._id, this.state.option, res => {
            if (res.status === 200) {
                this.props.fetchPool(this.props.pool._id);
            }
        });
    }
    renderTooltip({payload}) {
        if(payload[0]) {
            return(
                <Segment size='mini'>
                    <p>Option: {payload[0].payload.name}</p>
                    <p>Votes: {payload[0].payload.value}</p>
                </Segment> 
            );
        }
    }
    render() {
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
                                <Form.Select options={
                                    this.props.pool.options.map(opt => {
                                        return({
                                            key: opt._id,
                                            text: opt.option,
                                            value: opt._id
                                        });
                                    })
                                } 
                                placeholder='Choose an option'
                                onChange={this.handleChange.bind(this)}
                                />
                                <Form.Button type='submit' onClick={this.handleSubmit.bind(this)}>Submit</Form.Button>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={8}>
                                <PieChart width={400} height={400}>
                                <Pie dataKey='value' data={this.getChartData()}>
                                    {
                                        this.getChartData().map((entry, idx) => (
                                            <Cell key={`cell-${idx}`} fill={chartColors[idx]}/>
                                        ))
                                    }
                                </Pie>
                                <Legend />
                                <Tooltip content={this.renderTooltip} />
                            </PieChart>
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

export default connect(mapStateToProps, { fetchPool, vote })(PoolVote);