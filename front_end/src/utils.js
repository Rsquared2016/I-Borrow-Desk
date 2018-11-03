import React from 'react';
import { FormGroup, FormControl, ControlLabel, HelpBlock, Checkbox } from 'react-bootstrap';

const utils = {
  toPercentage: x => `${((x) * 100).toFixed(1)} %`,

  toPercentageNoScale: x => `${x.toFixed(1)}%`,

  toCommas: x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),

  renderField: ({ input, label, type, meta: { touched, error } }) =>
    (<FormGroup validationState={touched && error ? 'error' : 'success'}>
      <ControlLabel>
        {label}
      </ControlLabel>
      <FormControl
        {...input}
        type={type}
      />
      <HelpBlock>
        {touched && error ? error : ''}
      </HelpBlock>
    </FormGroup>),

  renderCheckbox: ({ input, label }) =>
    (<FormGroup>
      <Checkbox {...input}>
        {label}
      </Checkbox>
    </FormGroup>),
};

export default utils;