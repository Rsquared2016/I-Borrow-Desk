if (typeof window.Promise !== 'function') {
 require('es6-promise').polyfill();
}
import 'react-widgets/dist/css/react-widgets.css';
import './css/style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import {
  Router,
  Route,
} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import { reducer as formReducer } from 'redux-form';

import { ReactGA, analyticsMiddleware } from './analytics';

import { fetchProfile, fetchWatchlist } from './actions/index';

import App from './components/app';
import Popups from './components/popups';
import Navbar from './components/nav-bar';
import Footer from './components/footer';
import Trending from './components/trending';
import HistoricalReport from './components/historical-report';
import Watchlist from './components/watchlist';
import Register from './components/register';
import FilterStocks from './components/filter-stocks';
import About from './components/about';
import ChangeLog from './components/changelog';
import MessageBox from './components/message-box';



import {StockReducer, CompanySearchReducer, TrendingReducer, WatchlistReducer,
  AuthReducer, MessageReducer, FilteredStocksReducer, MostExpensiveReducer }
  from './reducers/index';


const reducer = combineReducers({
  stock: StockReducer,
  companies: CompanySearchReducer,
  trending: TrendingReducer,
  form: formReducer,
  auth: AuthReducer,
  watchlist: WatchlistReducer,
  message: MessageReducer,
  filteredStocks: FilteredStocksReducer,
  mostExpensive: MostExpensiveReducer
 });

const store = createStore(
  reducer,
  (sessionStorage.token) ? { auth: {authenticated: true, showLogin: false }} : {},
  compose(
    applyMiddleware(thunk, analyticsMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);


if (store.getState().auth.authenticated) {
  store.dispatch(fetchProfile());
  store.dispatch(fetchWatchlist());
}

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={createBrowserHistory()} onUpdate={logPageView}>
      <Grid>
        <Row>
          <Col>
            <Navbar />
            <Popups />
            <MessageBox />
            <Route exact path="/" component={App} />
            <Route path="/report/:ticker" component={HistoricalReport} />
            <Route path="/trending" component={Trending} />
            <Route path="/watchlist" component={Watchlist} />
            <Route path="/register" component={Register} />
            <Route path="/filter" component={FilterStocks} />
            <Route path="/about" component={About} />
            <Route path="/changelog" component={ChangeLog} />
          </Col>
        </Row>
        <Footer />
      </Grid>
    </Router>
  </Provider>
  , document.querySelector('.container'));