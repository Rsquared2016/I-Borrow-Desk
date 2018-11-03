import { ReactGA } from '../analytics';
import {
  FETCH_STOCK,
  UPDATE_COMPANY_SEARCH,
  RESET_COMPANY_SEARCH,
  FETCH_TRENDING,
  SHOW_FORGOT_PASSWORD,
  RESET_PASSWORD_SUCCESS,
}
  from '../actions/index';
import { LOGIN_SUCCESS, LOGOUT_ACTION, SHOW_LOGIN, HIDE_LOGIN, SHOW_PREFERENCES, HIDE_PREFERENCES }
  from '../actions/index';
import { REGISTER_SUCCESS, FETCH_PROFILE } from '../actions/index';
import { FETCH_WATCHLIST, ADD_WATCHLIST, REMOVE_WATCHLIST, CLEAR_WATCHLIST } from '../actions/index';
import { CLEAR_MESSAGE } from '../actions/index';
import { UPDATE_FILTER, UPDATE_MOST_EXPENSIVE } from '../actions/index';
import { CHANGE_EMAIL_SUCCESS, CHANGE_PASSWORD_SUCCESS } from '../actions/index';


export const StockReducer = (state={}, action) => {
  switch (action.type) {
    case FETCH_STOCK:
      return {...action.payload.data, active: 'real_time'};
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
  (state={ authenticated: false, showLogin: false, showForgotPassword: false, username: '', id: '', receiveEmail: false,
    showPreferences: false}, action) => {
  switch(action.type) {
    case LOGIN_SUCCESS:
      sessionStorage.token = action.payload;
      return {...state, authenticated: true, showLogin: false};
    case LOGOUT_ACTION:
      ReactGA.set({userId: undefined });
      sessionStorage.removeItem('token');
      return {...state, authenticated: false, showLogin: false, username: '', id: ''};
    case SHOW_LOGIN:
      ReactGA.set({userId: undefined });
      sessionStorage.removeItem('token');
      return {...state, authenticated: false, showLogin: true, username: '', id: ''};
    case SHOW_FORGOT_PASSWORD:
      ReactGA.set({userId: undefined });
      sessionStorage.removeItem('token');
      return {...state, authenticated: false, showLogin: false, showForgotPassword: true, username: '', id: ''};
    case FETCH_PROFILE:
      ReactGA.set({userId: action.payload.id });
      return {...state, username: action.payload.username, id: action.payload.id,
        receiveEmail: action.payload.receiveEmail};
    case HIDE_LOGIN:
      return {...state, showLogin: false};
    case HIDE_PREFERENCES:
      return {...state, showPreferences: false};
    case SHOW_PREFERENCES:
      return {...state, showPreferences: true};
    default:
      return state;
  }
};

export const WatchlistReducer = (state=[], action) => {
  switch(action.type) {
    case FETCH_WATCHLIST:
      if (action.payload.data.watchlist) {
        return [...action.payload.data.watchlist];
      } else if (action.payload.data.hasOwnProperty('watchlist')) {
        return [];
      } 
        return state;
      
    case CLEAR_WATCHLIST:
      return [];
    default:
      return state;
  }
};

export const MessageReducer = (state={text: '', type: ''}, action) => {
  switch(action.type) {
    case REGISTER_SUCCESS:
      return {text: 'Registration successful! In order to login you will need to confirm the email address you signed up with. Check your email for a link!', type: 'success'};
    case LOGIN_SUCCESS:
      return {text: 'Welcome!', type: 'success'};
    case ADD_WATCHLIST:
      return {text: `Added ${action.payload} to your watchlist`, type: 'info' };
    case REMOVE_WATCHLIST:
      return {text: `Removed ${action.payload} from your watchlist`, type: 'info' };
    case CHANGE_EMAIL_SUCCESS:
      return {text: 'Email successfully changed', type: 'success'};
    case CHANGE_PASSWORD_SUCCESS:
      return {text: 'Password successfully changed', type: 'success'};
    case RESET_PASSWORD_SUCCESS:
      return {text: 'A reset password link will be sent to the account associated with your email if it exists.', type: 'success'};
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