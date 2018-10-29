import { configure } from '@storybook/react';

function loadStories() {
  require('../src/storybooks/index.js');
  // You can require as many stories as you need.
}

configure(loadStories, module);