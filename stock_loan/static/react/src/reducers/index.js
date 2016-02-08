import { UPDATE_LOCATION } from 'redux-simple-router';

import {  FETCH_STOCK, UPDATE_COMPANY_SEARCH, RESET_COMPANY_SEARCH, FETCH_TRENDING}
  from '../actions/index';
import { DAILY, REAL_TIME } from '../actions/index';
import { LOGIN_SUCCESS, LOGOUT_ACTION, SHOW_LOGIN, HIDE_LOGIN }
  from '../actions/index';
import { REGISTER_SUCCESS, REGISTER_FAILURE } from '../actions/index';
import { FETCH_WATCHLIST, ADD_WATCHLIST, REMOVE_WATCHLIST } from '../actions/index';
import { CLEAR_MESSAGE } from '../actions/index';
import { UPDATE_FILTER, UPDATE_MOST_EXPENSIVE } from '../actions/index';

export const StockReducer = (state={}, action) => {
  switch (action.type) {
    case FETCH_STOCK:
      return {...action.payload.data, active: 'real_time'};
    case REAL_TIME:
      return {...state, active: 'real_time'};
    case DAILY:
      return {...state, active: 'daily'};
    default:
      return state;
  }
};

export const CompanySearchReducer = (state=[], action) => {
  switch(action.type) {
    case UPDATE_COMPANY_SEARCH:
      return action.payload.data.results;
    case RESET_COMPANY_SEARCH:
      return [];
  }
  return state;
};

export const TrendingReducer = (state={}, action) => {
  switch(action.type) {
    case FETCH_TRENDING:
      return {...action.payload.data};
    default:
      return state;
  }
};

export const AuthReducer =
  (state={ authenticated: false, token: null, showLogin: false},
   action) => {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return {authenticated: true,
        token: action.payload.data.access_token,
        showLogin: false};
    case LOGOUT_ACTION:
      return {authenticated: false,
        token: null,
        showLogin: false};
    case SHOW_LOGIN:
      return {authenticated: false,
        token: null,
        showLogin: true};
    case HIDE_LOGIN:
      return {...state, showLogin: false};
    default:
      return state
  }
};

export const WatchlistReducer = (state=[], action) => {
  switch(action.type) {
    case FETCH_WATCHLIST:
      if (action.payload.data.watchlist) return [...action.payload.data.watchlist];
      else return state;
    default:
      return state
  }
};

export const MessageReducer = (state={text: '', type: ''}, action) => {
  switch(action.type) {
    case REGISTER_SUCCESS:
      return {text: 'Registration successful!', type: 'success'};
    case LOGIN_SUCCESS:
      return {text: 'Welcome!', type: 'success'};
    case ADD_WATCHLIST:
      return {text: `Added ${action.payload} to your watchlist`, type: 'info' };
    case REMOVE_WATCHLIST:
      return {text: `Removed ${action.payload} from your watchlist`, type: 'info' };
    case UPDATE_LOCATION:
    case CLEAR_MESSAGE:
      return {text: '', type: ''};
    default:
      return state;
  }
};

export const FilteredStocksReducer = (state=[], action) => {
  switch(action.type) {
    case UPDATE_FILTER:
      return [...action.payload.data.results];
    default:
      return state;
  }
};

export const MostExpensiveReducer = (state=[], action) => {
  switch(action.type) {
    case UPDATE_MOST_EXPENSIVE:
      return [...action.payload.data.results];
    default:
      return state;
  }
};