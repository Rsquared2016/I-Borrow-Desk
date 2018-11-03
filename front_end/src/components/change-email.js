import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';

import utils from '../utils';
import { submitNewEmail } from '../actions/index';

class ChangeEmail extends Component {

  constructor(props) {
    super(props);
    this.state = {message: ''};
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <div>
        <h4>Change Email Address</h4>
        <form onSubmit={handleSubmit}>
          <Field
            name="password"
            component={utils.renderField}
            type="password"
            label="Re-enter Password"
          />
          <Field
            name="email"
            component={utils.renderField}
            type="email"
            label="New Email"
          />
          <Button type="submit">
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

function validate({ email, password }) {
  let errors = {};
  let emailRe = /\S+@\S+\.\S+/;

  if (!password) errors.password = 'Password required';
  if (!email) errors.email = 'Email address required';
  else if (!email.match(emailRe)) errors.email = 'Invalid Email Address';
  return errors;
}


export default reduxForm({
  form: 'EmailForm',
  validate,
  onSubmit: submitNewEmail
})(ChangeEmail);
