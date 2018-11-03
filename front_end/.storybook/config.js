import { configure } from '@storybook/react';

const req = require.context('../src/storybooks', true, /story\.js$/);

function loadStories() {
  require('../src/storybooks');
  req.keys().forEach(req);
}

configure(loadStories, module);