import React, { Component } from 'react';
import { Button, ButtonToolbar, Table, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import StockChart from './stock-chart';
import { fetchStock, addWatchlist } from '../actions/index';
import  utils from '../utils';

class HistoricalReport extends Component {

  componentWillMount() {
    this.props.fetchStock(this.props.params.ticker);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.ticker != this.props.params.ticker) {
      this.props.fetchStock(nextProps.params.ticker);
    }
  }

  renderTable(data) {
    data.reverse();
    return (
      <Col md={4} mdOffset={4} >
        <h3>Recent Data</h3>
        <Table condensed responsive hover>
          <thead>
            <tr>
              <th>Fee</th>
              <th>Available</th>
              <th align="right">Updated</th>
            </tr>
          </thead>
          <tbody>
            {data.map(el =>
              (<tr key={el.time}>
                <td>{utils.toPercentage(el.fee)}</td>
                <td>{utils.toCommas(el.available)}</td>
                <td>{el.time.replace("T", " ")}</td>
              </tr>)
            )}
          </tbody>
        </Table>
      </Col>
    )
  }

  render() {
    const { stock } = this.props;
    if (!stock.real_time) return <div>Loading...</div>;
    const data = stock.daily;
    return (
      <div>
        <h2>
          {stock.name} - {stock.symbol}
        </h2>
          <Button
            onClick={() => this.props.addWatchlist(stock.symbol)}
            bsStyle="success">
            Add to Watchlist
          </Button>
        <StockChart
          data={data}
          daily={true}
        />
        {this.renderTable(stock.real_time)}
      </div>
    )
  }
}

const mapStateToProps = ({ stock }) => {
  return { stock }
};

export default connect(mapStateToProps,
  { fetchStock, addWatchlist })
(HistoricalReport);
