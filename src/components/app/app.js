import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './app.css';
import NLU from '../nlu/nlu'
import Dialog from '../dialog/dialog'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.toggleNavbar = this.toggleNavbar.bind(this);

    this.state = {
      collapsed: true,
    }
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    // CIO Dialog System
    return (
      <Router>
        <div>
          <Navbar color="faded" light expand="md">
            <NavbarBrand href="/" className="mr-auto brand-title">X</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav navbar right="true" className="ml-auto">
                <NavItem>
                  <NavLink tag={Link} to="/">NLU</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/dialog">Dialog</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>

          {/* main container */}
          <Route path="/" exact component={NLU} />
          <Route path="/dialog/" component={Dialog} />
        </div>
      </Router>

    );
  }
}

export default App;
