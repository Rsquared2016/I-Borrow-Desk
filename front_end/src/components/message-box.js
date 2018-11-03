import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Alert } from 'react-bootstrap';
import { clearMessage } from '../actions';

class MessageBox extends Component {

  componentDidMount() {
    // Automatically hide the message box after 5s
    setTimeout(() => this.props.clearMessage(), 5000);
  }

  render () {
    const message = this.props.message;
    if (message.text) {
      return (
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
        </Grid>
      );
    }
    
      return <div />;
    
  }
}

// MessageBox.propTypes = {
//   message : PropTypes.object,
//   handleDismiss : PropTypes.func
// };

const mapStateToProps = state => ({
  message: state.message,
});

export default connect(mapStateToProps, { clearMessage })(MessageBox);