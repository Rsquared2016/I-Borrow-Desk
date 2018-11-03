import React from 'react';
import { storiesOf } from '@storybook/react';
import { _StockChart } from '../components/stock-chart';
import { TSLA } from './fixtures/TSLA.js';

const Normal = () => (
  <_StockChart
    historicalData={TSLA.daily}
    daily={true}
    width={1000}
    ratio={1}
  />
);

storiesOf('StockChart', module)
  .add('normal', Normal);
