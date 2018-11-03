import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore} from 'redux';
import { addDecorator } from '@storybook/react';

const store = createStore(() => {});

export const Provider = (story) => (
  <ReduxProvider store={store}>
    {story()}
  </ReduxProvider>
);


addDecorator(Provider);