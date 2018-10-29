import React from 'react';
import {
  Modal,
} from 'react-bootstrap';

export default ({ show, onHide, title, children }) => (
 <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {children}
    </Modal.Body>
  </Modal>
);
