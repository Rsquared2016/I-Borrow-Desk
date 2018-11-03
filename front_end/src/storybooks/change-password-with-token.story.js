import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { reduxForm } from 'redux-form';
import { _ChangePasswordWithToken } from '../components/change-password-with-token';


const ReduxChangePasswordWithToken = reduxForm({
  form: 'ChangePasswordWithTokenForm',
  onSubmit: action('resetPassword'),
})(_ChangePasswordWithToken);


storiesOf('ChangePasswordWithToken', module)
  .add('normal', () => (
    <ReduxChangePasswordWithToken
      dispatchHidePasswordReset={action('dispatchHideChangePasswordWithToken')}
      handleSubmit={(e) => { e.preventDefault(); action('handleSubmit')(); }}
    />
  ));
