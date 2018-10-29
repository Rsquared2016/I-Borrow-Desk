import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ForgotPassword from '../components/forgot-password';

storiesOf('ForgotPassword', module)
  .add('normal', () => (
    <ForgotPassword />
  ));