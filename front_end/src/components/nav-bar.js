import React from 'react';
import { connect } from 'react-redux';
import {
  Navbar,
  Nav,
  NavDropdown,
  NavItem,
  MenuItem,
  Row,
  Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

import {
  logoutAction,
  showLoginAction,
  showPreferencesAction,
} from '../actions/index';
import SearchBar from './search-bar';

const _Navbar = ({
  authenticated,
  username,
  dispatchLogout,
  dispatchShowPreferences,
  dispatchShowLogin,
}) => (
  <Row>
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">IBorrowDesk</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/trending">
            <NavItem>Trending</NavItem>
          </LinkContainer>
          <LinkContainer to="/filter">
            <NavItem>Filter</NavItem>
          </LinkContainer>
          <LinkContainer to="/about">
            <NavItem>About</NavItem>
          </LinkContainer>
          <LinkContainer to="/changelog">
            <NavItem>Changes</NavItem>
          </LinkContainer>
          <NavItem href="https://twitter.com/IBorrowDesk" target="_blank">
            @IBorrowDesk
          </NavItem>
          <NavItem href="https://www.patreon.com/iborrowdesk" target="_blank">
            Patreon
          </NavItem>
          {authenticated &&
          <LinkContainer to="watchlist">
            <NavItem>Watchlist</NavItem>
          </LinkContainer>}
        </Nav>
        <Nav pullRight>
          {authenticated &&
          <NavDropdown title={username || ''} id="nav-dropdown">
            <MenuItem href="#" onClick={dispatchLogout}>
             Logout
            </MenuItem>
            <MenuItem onClick={dispatchShowPreferences}>
              Preferences
            </MenuItem>
          </NavDropdown>}
          {!authenticated &&
          <LinkContainer to="/register">
            <NavItem>Register</NavItem>
          </LinkContainer>}
          {!authenticated &&
          <NavItem onClick={dispatchShowLogin}>
            Login
          </NavItem>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    <Row>
      <Col md={8} xs={12} mdOffset={2}>
        <SearchBar />
      </Col>
    </Row>
  </Row>
);

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  username: state.auth.username,
  message: state.message,
  mostExpensive: state.mostExpensive,
});

export default connect(
  mapStateToProps,
  {
    dispatchLogout: logoutAction,
    dispatchShowLogin: showLoginAction,
    dispatchShowPreferences: showPreferencesAction,
  }
)(_Navbar);