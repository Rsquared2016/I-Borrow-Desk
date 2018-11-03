import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'react-bootstrap';
import Modal from './common/modal';
import {
  hideForgotPasswordAction,
  resetPassword,
} from '../actions';
import utils from '../utils';

export const _ForgotPassword = ({
  dispatchHideForgotPassword,
  handleSubmit,
}) => (
  <Modal show onHide={dispatchHideForgotPassword} title={'Forgot Password'}>
    <form onSubmit={handleSubmit} title="ForgotPassword">
      <Field
        name="email"
        component={utils.renderField}
        type="text"
        label="Email"
      />
      <Button type="submit">
        Submit
      </Button>
    </form>
  </Modal>
);

const validate = ({ email }) => {
  let errors = {};
  let emailRe = /\S+@\S+\.\S+/;

  if (!email) errors.email = 'Email address required';
  else if (!email.match(emailRe)) errors.email = 'Invalid Email Address';
  return errors;
};

const ReduxForgotPassword = reduxForm({
  form: 'ForgotPasswordForm',
  validate,
  onSubmit: resetPassword,
})(_ForgotPassword);

export default connect(
  null,
  {
    dispatchHideForgotPassword: hideForgotPasswordAction,
  }
)(ReduxForgotPassword);