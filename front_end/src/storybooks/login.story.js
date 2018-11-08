import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { reduxForm } from 'redux-form';
import { _Login } from '../components/login';

const ReduxLogin = reduxForm({
  form: 'LoginForm',
  onSubmit: action('login'),
})(_Login);


storiesOf('Login', module)
  .add('normal', () => (
    <ReduxLogin
      hideLoginAction={action('dispatchHideLogin')}
      showForgotPasswordAction={action('showForgotPasswordAction')}
      handleSubmit={(e) => { e.preventDefault(); action('handleSubmit')(); }}
    />
  ));
