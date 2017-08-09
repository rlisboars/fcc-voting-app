import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route } from 'react-router-dom';
import promise from 'redux-promise';
import './App.css';

import reducers from './reducers';

import Header from './components/Header';
import PoolList from './components/PoolList';
import Login from './components/Login';
import Signup from './components/Signup';
import PoolCreation from './components/PoolCreation';
import PoolVote from './components/PoolVote';

const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

class App extends Component {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers, { poolsFilter: { filter: "recent", page: 1 }})}>
        <BrowserRouter>
          <div>
            <Header />
            <div className="ui main container">
              <Route exact path="/" component={PoolList} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/create" component={PoolCreation} />
              <Route path="/pool/:id" component={PoolVote} />
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
