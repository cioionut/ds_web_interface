import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

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

    console.log(process.env.PUBLIC_URL);
    
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
      <Router basename={process.env.PUBLIC_URL}>
        <div>
          <Navbar color="faded" light expand="md">
            <NavbarBrand tag={Link} to="/" className="mr-auto brand-title">CIO Dialog System</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav navbar right="true" className="ml-auto">
                <NavItem>
                  <NavLink tag={Link} to="/">Assistant</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/nlu">NLU</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>

          {/* main container */}
          <Switch>
            <Route path="/nlu" component={NLU} />
            <Route path="/" component={Dialog} />
          </Switch>

        </div>
      </Router>

    );
  }
}

export default App;
