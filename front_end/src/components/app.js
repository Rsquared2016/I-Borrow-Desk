import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import {
  logoutAction,
  showLoginAction,
  showPreferencesAction,
  clearMessage,
  fetchMostExpensive,
} from '../actions/index';
import StockTable from './stock-table';

class App extends Component {

  componentDidMount() {
    this.props.fetchMostExpensive();
  }
  render() {
   return (
      <div>
        <h2>Welcome to IBorrow Desk</h2>
        <p>If you haven't already, please consider <Link to="/register">registering!</Link> Registered
          users can maintain a watchlist, and receive (optional)
          morning updates. I'll also really appreciate it!
        </p>
        <h4>America's most expensive borrows</h4>
        <StockTable
          stocks={this.props.mostExpensive}
          type="fee"
          showUpdated />
      </div>
    );
  }
}

const mapStateToProps = state => ({
    auth: state.auth,
    message: state.message,
    mostExpensive: state.mostExpensive
  });

export default connect(mapStateToProps,
  { logoutAction, showLoginAction, showPreferencesAction, clearMessage, fetchMostExpensive })
(App);