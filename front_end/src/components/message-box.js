import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Alert } from 'react-bootstrap';
import { clearMessage } from '../actions';

class _MessageBox extends Component {
  componentDidMount() {
    // Automatically hide the message box after 5s
    setTimeout(() => this.props.clearMessage(), 5000);
  }
  render () {
    const message = this.props.message;
    return message.text ?
      <Grid>
        <Row>
          <Col md={6} xs={12} mdOffset={3}>
            <Alert
              bsStyle={message.type}
              closeLabel="Close"
              onDismiss={this.props.handleDismiss}>
              {message.text}
            </Alert>
          </Col>
        </Row>
      </Grid> :
      <div />
  }
}

const MessageBox = ({ message, clearMessage }) =>
  message.text && <_MessageBox message={message} clearMessage={clearMessage} />;


const mapStateToProps = state => ({
  message: state.message,
});

export default connect(mapStateToProps, { clearMessage })(MessageBox);