import React from 'react';
import { connect } from 'react-redux';
import Login from './login';
import Preferences from './preferences';
import ForgotPassword from './forgot-password';
import ChangePasswordWithToken from './change-password-with-token';

const Popups = ({
  showLogin,
  showPreferences,
  showForgotPassword,
  showChangePasswordWithToken,
}) => (
  <React.Fragment>
    <hr />
    {showLogin && <Login />}
    {showPreferences && <Preferences />}
    {showForgotPassword && <ForgotPassword />}
    {showChangePasswordWithToken && <ChangePasswordWithToken />}
  </React.Fragment>
);

const mapStateToProps = ({ auth }) => ({
  showLogin: auth.showLogin,
  showPreferences: auth.showPreferences,
  showForgotPassword: auth.showForgotPassword,
  showChangePasswordWithToken: auth.showChangePasswordWithToken,
});

export default connect(mapStateToProps)(Popups);