import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { Button } from 'react-bootstrap';
import Modal from './common/modal';
// import {
//   hideForgotPasswordAction,
//   resetPassword,
// } from '../actions';
import utils from '../utils';

export const _ForgotPassword = ({
  dispatchHideForgotPassword,
  onSubmit,
}) => (
  <Modal show onHide={dispatchHideForgotPassword} title={'Forgot Password'}>
    <form onSubmit={onSubmit} title="ForgotPassword">
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
//
// const ReduxForgotPassword = reduxForm({
//   form: 'ForgotPasswordForm',
//   onSubmit: resetPassword,
// })(_ForgotPassword);

// export default connect(
//   null,
//   {
//     dispatchHideForgotPassword: hideForgotPasswordAction,
//   }
// )(ReduxForgotPassword);