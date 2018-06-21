import React, {Component, PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import utils from '../utils';
import {hideLoginAction, submitLogin} from '../actions/index';

let Login = props => {
  const { show, hideLoginAction, handleSubmit } = props;
  return (
    <Modal show={show} onHide={hideLoginAction}>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} name="login">
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
        </form>
      </Modal.Body>
    </Modal>
  )
};


function validate(values) {
  let errors = {};
  if (!values.username) errors.username = 'Username required';
  if (!values.password) errors.password = 'Password required';
  return errors;
}

const mapDispatchToProps = dispatch => ({
  hideLoginAction: bindActionCreators(hideLoginAction, dispatch)
});

Login = reduxForm({
  form: 'LoginForm',
  onSubmit: submitLogin,
  validate
})(Login);

Login = connect(null, mapDispatchToProps)(Login);
//
export default Login;