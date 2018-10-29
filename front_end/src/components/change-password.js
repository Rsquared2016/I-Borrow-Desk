import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';

import utils from '../utils';
import { submitNewPassword } from '../actions/index';

class ChangeEmail extends Component {

  constructor(props) {
    super(props);
    this.state = {message: ''}
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <h4>Change Password</h4>
        <form onSubmit={handleSubmit}>
          <Field
            name="password"
            component={utils.renderField}
            type="password"
            label="Re-enter Password"
          />
          <Field
            name="newPassword"
            component={utils.renderField}
            type="password"
            label="New Password"
          />
          <Field
            name="confirmPassword"
            component={utils.renderField}
            type="password"
            label="Confirm Password"
          />
          <Button type="submit">
            Submit
          </Button>
        </form>
      </div>
    )
  }
}

function validate({ password, newPassword, confirmPassword }) {
  let errors = {};
  if (!password) errors.password = 'Password required';
  if (!newPassword) errors.newPassword = 'New Password required';
  else if (newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters.';
  if (newPassword !== confirmPassword) errors.confirmPassword = 'Password must match';
  return errors;
}


export default reduxForm({
  form: 'NewPasswordForm',
  validate,
  onSubmit: submitNewPassword
})(ChangeEmail);