import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default () => (
  <Row className="text-center">
    <Col>
      <hr />
      <p>This toy webapp is not affiliated with Interactive Brokers in any way.</p>
      <p>Every row of data is probably wrong as I have no idea what I am doing.
        Please do not sue me, this was a fun project I did to practice developing web-apps.
        Nothing on this site should be in any way construed as a recommendation to buy
        or sell any security. Or do anything whatsoever.</p>
    </Col>
  </Row>
);