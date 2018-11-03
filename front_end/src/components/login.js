import React from 'react';
import {Button, FormGroup, HelpBlock} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Modal from './common/modal';

import utils from '../utils';
import {hideLoginAction, submitLogin, showForgotPasswordAction} from '../actions/index';

const _Login = ({
  hideLoginAction,
  showForgotPasswordAction,
  handleSubmit,
  error,
}) => {
  return (
    <Modal show onHide={hideLoginAction} title="Login">
      <form onSubmit={handleSubmit} name="login">
        <FormGroup validationState={error && 'error'}>
          <Field
            name="username"
            component={utils.renderField}
            type="text"
            label="Username"
          />
          <Field
            name="password"
            component={utils.renderField}
            type="password"
            label="Password"
          />
          <Button type="submit">
            Submit
          </Button>
          <HelpBlock>
            {error ? error : ''}
          </HelpBlock>
        </FormGroup>
      </form>
      <a href="#" onClick={showForgotPasswordAction}>
        Forgot Password?
      </a>
    </Modal>
  );
};


function validate(values) {
  let errors = {};
  if (!values.username) errors.username = 'Username required';
  if (!values.password) errors.password = 'Password required';
  return errors;
}

const mapDispatchToProps = dispatch => ({
  hideLoginAction: bindActionCreators(hideLoginAction, dispatch),
  showForgotPasswordAction: bindActionCreators(showForgotPasswordAction, dispatch),
});

const ReduxLogin = reduxForm({
  form: 'LoginForm',
  onSubmit: submitLogin,
  validate
})(_Login);

export default connect(null, mapDispatchToProps)(ReduxLogin);