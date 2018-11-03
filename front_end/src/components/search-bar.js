import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Combobox } from 'react-widgets';
import _ from 'lodash';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { searchCompany, resetCompanySearch } from '../actions/index';

class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = { ticker: '' };
    this.onInputChange = this.onInputChange.bind(this);
    this.nameSearch = _.debounce(value => this.props.searchCompany(value), 300);
  }

  onInputChange(value) {
    if (typeof value === 'object') {
      this.setState({ticker: value.symbol});
    } else {
      this.setState({ticker: value});
      if (value.length > 2) this.nameSearch(value);
    }
  }

  optionClicked(value) {
    const ticker = value.symbol;
    this.setState({ ticker: '' });
    this.props.resetCompanySearch();
    this.props.history.push(`/report/${ticker}`);
  }

  render() {
    const companies = this.props.companySearch
      .map(el => ({
        symbol: el.symbol,
        name: `${el.name} - ${el.symbol}`,
      }));
    return (
      <Combobox
        data={companies}
        suggest={true}
        valueField="symbol"
        textField="name"
        placeholder="Enter a ticker or search a company by name"
        value={this.state.ticker}
        onChange={this.onInputChange.bind(this)}
        onSelect={this.optionClicked.bind(this)}
      />
    );
  }
}

const mapStateToProps = state => ({ companySearch: state.companies });
const mapDispatchToProps = dispatch =>
  ({
    searchCompany: bindActionCreators(searchCompany, dispatch),
    resetCompanySearch: bindActionCreators(resetCompanySearch, dispatch),
  });

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(SearchBar);