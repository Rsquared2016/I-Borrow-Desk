import React from 'react';
import { Grid, Row, Col, Button, Input, FormGroup, ButtonToolbar, ControlLabel } from 'react-bootstrap';
import { reduxForm, Field } from 'redux-form';

import { submitFilter } from '../actions/index';
import utils from '../utils';

const COUNTRIES = ['USA', 'Canada', 'Australia', 'Austria', 'Belgium', 'British', 'Dutch',
  'France', 'Germany', 'HongKong', 'India', 'Italy', 'Japan', 'Mexico', 'Spain',
  'Swedish', 'Swiss'];
const ORDER_OPTIONS = ['fee', 'available'];

const INITIAL_VALUES = {
  min_available: 0,
  max_available: 100000,
  min_fee: 0,
  max_fee: 100,
  country: 'USA',
  order_by: 'fee'
};

const filter = props => {
  const {reset, handleSubmit } = props;
  return (
    <Grid>
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} md={4}>
            <Field
              name="min_available"
              type="number"
              label="Minimum Available"
              component={utils.renderField}
            />
            <Field
              name="min_fee"
              type="number"
              label="Minimum Fee (%)"
              component={utils.renderField}
            />
          </Col>
          <Col xs={12} md={4}>
            <Field
              name="max_available"
              type="number"
              label="Maximum Available"
              component={utils.renderField}
            />
            <Field
              name="max_fee"
              type="number"
              label="Maximum Fee (%)"
              component={utils.renderField}
            />
          </Col>
          <Col xs={12} md={4}>
            <FormGroup>
              <ControlLabel>
                Country
              </ControlLabel>
              <Field
                name="country"
                type="select"
                component="select"
                className="form-control">
                {COUNTRIES.map(order =>
                  (<option value={order} key={order}>
                    {order}
                  </option>))}
              </Field>
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                Order By
              </ControlLabel>
              <Field
                name="order_by"
                type="select"
                component="select"
                className="form-control">
                {ORDER_OPTIONS.map(order =>
                  (<option value={order} key={order}>
                    {order}
                  </option>))}
              </Field>
            </FormGroup>
          </Col>
        </Row>
        <Row>
        <ButtonToolbar>
          <Button type="submit">
            Submit
          </Button>
          <Button type="reset" bsStyle="danger" onClick={reset}>
            Reset
          </Button>
        </ButtonToolbar>
        </Row>
      </form>
    </Grid>
  )
};



const validate = ({ min_available, max_available, min_fee, max_fee }) => {
  let errors = {};

  if (max_available <= min_available) {
    errors.min_available = 'Must be less than Maximum';
    errors.max_available = 'Must be greater than Minimum';
  }
  if (max_fee <= min_fee) {
    errors.min_fee = 'Must be less than Maximum';
    errors.max_fee = 'Must be greater than Minimum';
  }
  if (min_available < 0) errors.min_available = 'Must be positive.';
  if (max_available < 0) errors.max_available = 'Must be positive.';
  if (min_fee < 0) errors.min_fee = 'Must be positive.';
  if (max_fee < 0) errors.max_fee = 'Must be positive.';
  return errors;
};


export default reduxForm({
  form: 'FilterForm',
  validate,
  destroyOnUnmount: false,
  onSubmit: submitFilter,
  initialValues: INITIAL_VALUES
})(filter);