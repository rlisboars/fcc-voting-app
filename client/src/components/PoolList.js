import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Input, Table, Icon, Button, Label } from 'semantic-ui-react';

import { fetchPools, setPoolsFilter, deletePool } from '../actions';

class PoolList extends Component {
    poolsPerPage = 8;
    total = 0;
    
    constructor(props) {
        super(props);
        this.state = {
            filter: "",
            page: 0,
            message: undefined
        }
    }

    componentWillMount() {
        this.setState({
            filter: this.props.filters.filter,
            page: this.props.filters.page
        });
        this.props.fetchPools();
    }
    handleClick(poolId) {
        this.props.history.push('/pool/'+poolId);
    }
    setPage(page) {
        if (page >= 1 && page <= Math.ceil(this.total / this.poolsPerPage)) {
            this.setState({
                page
            });
            this.props.setPoolsFilter(this.state.filter, page);
        }
    }
    setFilter(evt, { name }) {
        this.setState({
            filter: name,
            page: 1
        });
        this.props.setPoolsFilter(name, 1);
    }
    deletePool(pool) {
        const user = localStorage.getItem('vote-app-user') ? JSON.parse(localStorage.getItem('vote-app-user')) : null;
        this.props.deletePool(pool._id, user.token, res => {
            if (res.status === 200) {
                this.setState({
                    message: res.data + ' deleted!'
                });
                setTimeout(() => {
                    this.setState({
                        message: undefined
                    })
                }, 4000);
            }
        });
    }
    renderPools() {
        if (this.props.total === 0) {
            return(
                <Table.Row>
                    <Table.Cell colSpan='4' textAlign='center'>No Pools found!</Table.Cell>
                </Table.Row>
            );
        }
        let sortedPools = _.toArray(this.props.pools).sort((p1, p2) => { 
            return new Date(p2.createdAt) - new Date(p1.createdAt);
        });
        switch(this.state.filter) {
            case "mostVoted":
                sortedPools.sort((p1,p2) => {
                    var res = p2.votes - p1.votes
                    if (res === 0) {
                        res = new Date(p2.createdAt) - new Date(p1.createdAt);
                    }
                    return res;
                });
                break;
            case "mine":
                if (this.props.user) {
                    sortedPools = sortedPools.filter(pool => this.props.user.id === pool.user._id);
                }
                break;
            default:
                break;
        }
        this.total = sortedPools.length;
         if (this.total === 0) {
            return(
                <Table.Row>
                    <Table.Cell colSpan='5' textAlign='center'>No Pools found!</Table.Cell>
                </Table.Row>
            );
        }
        const groupSize = this.poolsPerPage;
        var paginatedPools = _.map(sortedPools, function(pool, index) {
            return index % groupSize === 0 ? sortedPools.slice(index, index + groupSize) : null; 
        }).filter(function(pool){ return pool; });

        return paginatedPools[this.state.page-1].map(pool => {
            return(
                <Table.Row key={pool._id}>
                    <Table.Cell onClick={this.handleClick.bind(this, pool._id)}>{pool.pool}</Table.Cell>
                    <Table.Cell textAlign='center' onClick={this.handleClick.bind(this, pool._id)}>{pool.votes}</Table.Cell>
                    <Table.Cell textAlign='center' onClick={this.handleClick.bind(this, pool._id)}>{pool.user.name.split("@")[0]}</Table.Cell>
                    <Table.Cell textAlign='center' onClick={this.handleClick.bind(this, pool._id)}>{new Date(pool.createdAt).toLocaleString()}</Table.Cell>
                    { this.state.filter === 'mine' &&
                        <Table.Cell textAlign='center'>
                            <Button icon='trash outline' color='red' onClick={this.deletePool.bind(this, pool)} size='mini'/>
                        </Table.Cell>
                    }
                </Table.Row>
            );
        });
    }
    renderPagination() {
        const pages = Math.ceil(this.total / this.poolsPerPage);
        return Array.from({ length: pages }, (_, i) => {
            return(
                <Menu.Item as='a' active={this.state.page === i+1} key={i+1} onClick={this.setPage.bind(this, i+1)}>{i+1}</Menu.Item>
            );
        });
    }
    render() {
        const { pools } = this.props;
        if (!pools) {
            return <div>Loading...</div>
        }
        return(
            <div>
                <Menu pointing secondary>
                    <Menu.Item name='recent' active={this.props.filters.filter === 'recent'} onClick={this.setFilter.bind(this)}>Recent</Menu.Item>
                    <Menu.Item name='mostVoted' active={this.props.filters.filter === 'mostVoted'} onClick={this.setFilter.bind(this)}>Most Voted</Menu.Item>
                    { this.props.user &&
                        <Menu.Item name='mine' active={this.props.filters.filter === 'mine'} onClick={this.setFilter.bind(this)}>Mine</Menu.Item>
                    }
                    { this.state.message &&
                        <Menu.Item>
                            <Label color='green'>{this.state.message}</Label>
                        </Menu.Item>
                    }
                    <Menu.Menu position='right'>
                        <Menu.Item>
                            <Input transparent icon={{ name: 'search', link: true }} placeholder='Search pools...' />
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Table celled selectable>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={this.state.filter === 'mine' ? 6 : 7}>Pool</Table.HeaderCell>
                            <Table.HeaderCell width={1} textAlign='center'>Votes</Table.HeaderCell>
                            <Table.HeaderCell width={2} textAlign='center'>Posted by</Table.HeaderCell>
                            <Table.HeaderCell width={2} textAlign='center'>Date</Table.HeaderCell>
                            { this.state.filter === 'mine' &&
                                <Table.HeaderCell width={1} textAlign='center'>Delete</Table.HeaderCell>
                            }
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderPools()}
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='5'>
                                <Menu floated='right' pagination>
                                     <Menu.Item as='a' onClick={this.setPage.bind(this, this.state.page-1)} icon>
                                        <Icon name='left chevron' />
                                    </Menu.Item>
                                    {this.renderPagination()}
                                    <Menu.Item as='a' onClick={this.setPage.bind(this, this.state.page+1)} icon>
                                        <Icon name='right chevron' />
                                    </Menu.Item>
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        total: state.pools.total,
        pools: state.pools.pools,
        user: state.user.user,
        filters: state.poolsFilter
    };
}

export default connect(mapStateToProps, { fetchPools, setPoolsFilter, deletePool })(PoolList);
