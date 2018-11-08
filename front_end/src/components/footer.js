import React from 'react';
import { Row, Col } from 'react-bootstrap';

export default () => (
  <Row className="text-center">
    <Col>
      <hr />
      <p>
        This toy webapp is not affiliated with Interactive Brokers in any way.
      </p>
      <p>
        Nothing on this site should be in any way construed as a recommendation to buy
        or sell any security. Or do anything whatsoever.
      </p>
      <p>
        Still here? Great!
        If you like IBorrowDesk there's now a <a href="https://www.patreon.com/iborrowdesk" target="_blank">Patreon</a>!
      </p>
    </Col>
  </Row>
);