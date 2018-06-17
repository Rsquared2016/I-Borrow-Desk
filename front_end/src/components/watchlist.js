import React from 'react';
import { Component } from 'react';
import { FormGroup, Checkbox } from 'react-bootstrap';
import { connect } from 'react-redux';

import { fetchWatchlist, toggleMorningEmail } from '../actions/index';
import StockTable from './stock-table';

class Watchlist extends Component {

  componentWillMount() {
    this.props.fetchWatchlist();
  }

  render() {
    const watchlist = this.props.watchlist;
    return (
      <div>
        <form>
          <FormGroup>
            <Checkbox
              value={this.props.auth.receiveEmail}
              onChange={this.props.toggleMorningEmail}>
              Receive Morning email
            </Checkbox>
          </FormGroup>
        </form>
        <StockTable
          stocks={watchlist}
          showUpdated />
      </div>
    )
  }
}

const mapStateToProps = ({ watchlist, auth }) => ({ watchlist, auth });

export default connect(mapStateToProps,  { fetchWatchlist, toggleMorningEmail })(Watchlist);
