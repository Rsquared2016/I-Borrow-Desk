import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'react-bootstrap';
import Modal from './common/modal';
import {
  hideChangePasswordWithTokenAction,
  changePasswordWithToken,
} from '../actions';
import utils from '../utils';

export const _ChangePasswordWithToken = ({
  dispatchHideChangePasswordWithToken,
  handleSubmit,
}) => (
  <Modal show onHide={dispatchHideChangePasswordWithToken} title={'Reset Password'}>
    <p>
      If an account matches the email provided, a password reset token with be emailed to it
      momentarily. Copy and paste that token into the form below, along with a new password.
    </p>
    <form onSubmit={handleSubmit} title="Reset Password with Secure Token">
      <Field
        name="token"
        component={utils.renderField}
        type="text"
        label="Secure Token"
      />
      <Field
        name="password"
        type="password"
        label="Password"
        component={utils.renderField}
      />
      <Field
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        component={utils.renderField}
      />
      <Button type="submit">
        Submit
      </Button>
    </form>
  </Modal>
);

const validate = ({ token, password, confirmPassword }) => {
  let errors = {};

  if (!token) errors.token = 'Token required';
 if (!password) errors.password = 'Password required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (password !== confirmPassword) errors.confirmPassword = 'Password must match';
  return errors;
};

const ReduxChangePasswordWithToken = reduxForm({
  form: 'ChangePasswordWithTokenForm',
  validate,
  onSubmit: changePasswordWithToken,
})(_ChangePasswordWithToken);

export default connect(
  null,
  {
    dispatchHideChangePasswordWithToken: hideChangePasswordWithTokenAction,
  }
)(ReduxChangePasswordWithToken);