import axios from 'axios';
import { SubmissionError, reset } from 'redux-form';

export const UPDATE_COMPANY_SEARCH = 'UPDATE_COMPANY_SEARCH';
export const RESET_COMPANY_SEARCH = 'RESET_COMPANY_SEARCH';
export const FETCH_STOCK = 'FETCH_STOCK';
export const FETCH_TRENDING = 'FETCH_TRENDING';
export const FETCH_WATCHLIST = 'FETCH_WATCHLIST';
export const ADD_WATCHLIST = 'ADD_WATCHLIST';
export const REMOVE_WATCHLIST = 'REMOVE_WATCHLIST';
export const CLEAR_WATCHLIST = 'CLEAR_WATCHLIST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_ACTION = 'LOGOUT_ACTION';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';
export const CHANGE_EMAIL_SUCCESS = 'CHANGE_EMAIL_SUCCESS';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const SHOW_LOGIN = 'SHOW_LOGIN';
export const HIDE_LOGIN = 'HIDE_LOGIN';
export const SHOW_PREFERENCES = 'SHOW_PREFERENCES';
export const HIDE_PREFERENCES = 'HIDE_PREFERENCES';
export const SHOW_FORGOT_PASSWORD = 'SHOW_FORGOT_PASSWORD';
export const HIDE_FORGOT_PASSWORD = 'HIDE_FORGOT_PASSWORD';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const SHOW_CHANGE_PASSWORD_WITH_TOKEN = 'SHOW_RESET_WITH_TOKEN';
export const HIDE_CHANGE_PASSWORD_WITH_TOKEN = 'SHOW_RESET_WITH_TOKEN';
export const CHANGE_PASSWORD_WITH_TOKEN_SUCCESS = 'RESET_WITH_TOKEN_SUCCESS';
export const FETCH_PROFILE = 'FETCH_PROFILE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';
export const UPDATE_FILTER = 'UPDATE_FILTER';
export const UPDATE_MOST_EXPENSIVE = 'UPDATE_MOST_EXPENSIVE';

export const searchCompany = name => {
  return dispatch => {
    return axios.get(`/api/search/${name}`)
      .then(response => dispatch({
        type: UPDATE_COMPANY_SEARCH,
        payload: response,
        meta: {
          analytics: {
            type: 'searchCompany',
            payload: name
          }
        }
      }))
      .catch(err => console.log('error in searchCompany', err));
  };
};

export const resetCompanySearch = () => ({
  type: RESET_COMPANY_SEARCH,
  meta: {
    analytics: {
      type: 'reset-company-search'
    }
  }
});

export const fetchStock = ticker =>
  dispatch =>
    makeOptionalAuthRequest().get(`/api/ticker/${ticker}`)
      .then(response => dispatch({
        type: FETCH_STOCK,
        payload: response,
        meta: {
          analytics: {
            type: 'fetch-stock',
            payload: ticker
          }
        }
      }
      ));

export const fetchTrending = () => {
  return dispatch => {
    return axios.get('/api/trending')
      .then(response => dispatch({
        type: FETCH_TRENDING,
        payload: response,
        meta: {
          analytics: {
            type: 'fetch-trending'
          }
        }
      }))
      .catch(err => console.log(err));
  };
};

const _authRequest = token =>
  axios.create({ headers: {'Authorization': `Bearer ${token}`} });

const makeOptionalAuthRequest = () => {
  const token = sessionStorage.token;
  return token ? _authRequest(token) : axios.create();
};

const makeAuthRequest = () => {
  const token = sessionStorage.token;
  return _authRequest(token);
};

export const fetchWatchlist = () => {
  return (dispatch) => {
    return makeAuthRequest().get('/api/watchlist')
      .then(response => {
        dispatch({
          type: FETCH_WATCHLIST,
          payload: response,
          meta: {
            analytics: {
              type: 'fetch-watchlist'
            }
          }
        });
      }).catch(err => {
        dispatch({type: SHOW_LOGIN, payload: err});
      });
  };
};

export const addWatchlist = symbol => {
  return (dispatch) => {
    return makeAuthRequest().post('/api/watchlist', { symbol })
      .then(response => {
        dispatch({
          type: ADD_WATCHLIST,
          payload: symbol,
          meta: {
            analytics: {
              type: 'add-watchlist',
              payload: symbol
            }
          }
        });
        dispatch({
          type: FETCH_WATCHLIST,
          payload: response,
          meta: {
            analytics: {
              type: 'fetch-watchlist'
            }
          }
        });
      })
      .catch(err => dispatch({type: SHOW_LOGIN, payload: err}));
  };
};

export const removeWatchlist = symbol =>
  (dispatch) =>
    makeAuthRequest().delete(`/api/watchlist?symbol=${symbol}`)
      .then(response => {
        dispatch({
          type: REMOVE_WATCHLIST,
          payload: symbol,
          meta: {
            analytics: {
              type: 'remove-watchlist',
              payload: symbol
            }
          }
        });
        dispatch({
          type: FETCH_WATCHLIST,
          payload: response,
          meta: {
            analytics: {
              type: 'fetch-watchlist'
            }
          }
        });
      })
      .catch(err => dispatch({type: SHOW_LOGIN, payload: err}));


export const showLoginAction = () => ({type: SHOW_LOGIN });
export const hideLoginAction = () => ({type: HIDE_LOGIN });

export const showPreferencesAction = () => ({type: SHOW_PREFERENCES });
export const hidePreferencesAction = () => ({type: HIDE_PREFERENCES });

export const showForgotPasswordAction = () => ({type: SHOW_FORGOT_PASSWORD });
export const hideForgotPasswordAction = () => ({type: HIDE_FORGOT_PASSWORD });

export const hideChangePasswordWithTokenAction = () => ({type: HIDE_CHANGE_PASSWORD_WITH_TOKEN });

export const resetPassword = ({ email }, dispatch) =>
  axios.post('/api/reset_password', { email })
    .then(_response => {
      dispatch(reset('ForgotPasswordForm'));
      dispatch({ type: RESET_PASSWORD_SUCCESS });
      dispatch({ type: SHOW_CHANGE_PASSWORD_WITH_TOKEN });
    });

export const changePasswordWithToken = ({ password, token }, dispatch) =>
  axios.post('/api/change_password_with_token', { password, token })
    .then(_response => {
      dispatch(reset('ChangePasswordWithTokenForm'));
      dispatch({ type: CHANGE_PASSWORD_WITH_TOKEN_SUCCESS });
      dispatch({ type: SHOW_LOGIN });
    });

export const submitLogin = (values, dispatch) =>
  axios.post('/api/auth', values)
    .then(response => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data.access_token,
        meta: {
            analytics: {
              type: 'login'
            }
          }});
      dispatch(fetchProfile());
      dispatch(fetchWatchlist());
      dispatch(reset('LoginForm'));
    })
    .catch(error => {
      throw new SubmissionError({ _error: error.response.data.msg });
    });

export const fetchProfile = () => {
  return (dispatch, getState) => {
    return makeAuthRequest().get('/api/user')
      .then(response => {
        dispatch({type: FETCH_PROFILE, payload: response.data});
      }).catch(error => {
        console.log('error in fetch profile');
        dispatch({type: SHOW_LOGIN, payload: error});
      });
  };
};

export const toggleMorningEmail = () =>
  dispatch =>
    makeAuthRequest().post('/api/user/morning')
      .then(response => dispatch(fetchProfile()))
      .catch(err => console.log('error in toggle morning email'));


export const submitNewEmail = (values, dispatch) =>
  makeAuthRequest().post('/api/user/email', values)
    .then(response => {
      dispatch({
        type: CHANGE_EMAIL_SUCCESS,
        meta: {
            analytics: {
              type: 'changed-email'
            }
          }
      });
      dispatch({type: HIDE_PREFERENCES });
    })
    .catch(error => {
      if (error.response.status === 401) {
        throw new SubmissionError({
          _error: 'Password Incorrect Failed',
          password: 'Password Incorrect'
        });
      } else {
        console.log('Unhandled error', error);
      }
    });

export const submitNewPassword = (values, dispatch) =>
  makeAuthRequest().post('/api/user/password', values)
    .then(response => {
      dispatch({
        type: CHANGE_PASSWORD_SUCCESS,
        meta: {
            analytics: {
              type: 'changed-password'
            }
          }});
      dispatch({type: HIDE_PREFERENCES });
    })
    .catch(error => {
      if (error.response.status === 401) {
        throw new SubmissionError({
          _error: 'Password Incorrect',
          password: 'Password incorrect'
        });
      } else {
        console.log('Unhandled error', error);
      }
    });


export const logoutAction = () => ((dispatch) => {
  dispatch({
    type: LOGOUT_ACTION,
    meta: {
      analytics: {
        type: 'logout'
      }
    }
  });
  dispatch({ type: CLEAR_WATCHLIST });
});


export const submitRegister = (values, dispatch) =>
  axios.post('/api/register', values)
    .then(response => {
      dispatch({type: REGISTER_SUCCESS, payload: response});
      dispatch(reset('RegisterForm'));
    })
    .catch(error => {
      throw new SubmissionError({
        _error: 'Registration Failed',
        ...error.response.data.errors});
    });


export const clearMessage = () => ({ type: CLEAR_MESSAGE });


export const submitFilter = (values, dispatch) => {
  return axios.get('/api/filter', {params: values})
    .then(response => {
      dispatch({
        type: UPDATE_FILTER,
        payload: response,
        meta: {
            analytics: {
              type: 'submit-filter'
            }
          }
      });
    })
    .catch(error => {
      console.log('error in submitFilter', error);
      throw new SubmissionError({
        _error: 'Error in Filter Submission',
        ...error.response.data.errors
      });
    });
};

export const fetchMostExpensive = () =>
  dispatch =>
    axios.get('/api/filter/most_expensive')
      .then(response => dispatch({type: UPDATE_MOST_EXPENSIVE, payload: response}))
      .catch(err => console.log(err));