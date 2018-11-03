import React from 'react';
import { connect } from 'react-redux';
import Login from './login';
import Preferences from './preferences';
import ForgotPassword from './forgot-password';

const Popups = ({
  showLogin,
  showPreferences,
  showForgotPassword,
}) => (
  <React.Fragment>
    <hr />
    {showLogin && <Login />}
    {showPreferences && <Preferences />}
    {showForgotPassword && <ForgotPassword />}
  </React.Fragment>
);

const mapStateToProps = ({ auth }) => ({
  showLogin: auth.showLogin,
  showPreferences: auth.showPreferences,
  showForgotPassword: auth.showForgotPassword,
});

export default connect(mapStateToProps)(Popups);