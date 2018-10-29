import React from 'react';
import { connect } from 'react-redux';
import Login from './login';
import Preferences from './preferences';
import ForgotPassword from './forgot-password';

const Popups = ({
  auth,
}) => (
  <React.Fragment>
    <hr />
    <Login show={auth.showLogin} />
    <Preferences show={auth.showPreferences} />
    <ForgotPassword show={auth.showForgotPassword} />
  </React.Fragment>
);

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Popups);