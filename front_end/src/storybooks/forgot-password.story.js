import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { reduxForm } from 'redux-form';
import { _ForgotPassword } from '../components/forgot-password';


const ReduxForgotPassword = reduxForm({
  form: 'ForgotPasswordForm',
  onSubmit: action('resetPassword'),
})(_ForgotPassword);


storiesOf('ForgotPassword', module)
  .add('normal', () => (
    <ReduxForgotPassword
      dispatchHideForgotPassword={action('dispatchHideForgotPassword')}
      handleSubmit={(e) => { e.preventDefault(); action('handleSubmit')(); }}
    />
  ));
