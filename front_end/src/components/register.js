import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap';
import {reduxForm, Field} from 'redux-form';

import utils from '../utils';
import {submitRegister} from '../actions/index';

class Register extends Component {

  render() {
    const {handleSubmit} = this.props;
    return (
      <Grid>
        <Row>
          <Col xs={12} md={6} mdOffset={3}>
            <h4>Register to maintain a watchlist and receive morning updates!</h4>
            <form onSubmit={handleSubmit}>
              <Field
                name="username"
                component={utils.renderField}
                type="text"
                label="Username"
              />
              <Field
                name="email"
                type="email"
                label="Email"
                component={utils.renderField}
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
              <Field
                name="receiveEmail"
                type="checkbox"
                label="Receive Morning Email"
                component={utils.renderCheckbox}
                checked
              />
              <Button type="submit">
                Register
              </Button>
            </form>
          </Col>
        </Row>
      </Grid>
    );
  }
}

const validate = ({username, password, confirmPassword, email}) => {
  let errors = {};
  let emailRe = /\S+@\S+\.\S+/;

  if (!username) errors.username = 'Username required';
  else if (username.length < 6) errors.username = 'Username must be at least 6 characters.';

  if (!password) errors.password = 'Password required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (password !== confirmPassword) errors.confirmPassword = 'Password must match';

  if (!email) errors.email = 'Email address required';
  else if (!email.match(emailRe)) errors.email = 'Invalid Email Address';

  return errors;
};

export default reduxForm({
  form: 'RegisterForm',
  onSubmit: submitRegister,
  validate
})(Register);