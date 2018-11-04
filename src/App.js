import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Form, FormGroup, Label, Input, FormText
} from 'reactstrap';


class NLUResponse extends Component {
  constructor(props) {
    super(props);
    this.slotList = "test slot"
  }

  render() {
    return (
      <div>
        <p>Intent: {this.props.intent}</p>
        <p>Slots:</p>
        <ul>
          {this.slotList}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleUtterance = this.handleUtterance.bind(this);
  
    this.state = {
      collapsed: true,
      nluResponse: {
        "intent": "test",
        "slots": {
          "slot0": "utt_word",
          "slot1": "utt_word"
        }
      }
    };
  }

  handleUtterance(elem) {
    elem.preventDefault()
    console.log("request to server")
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }
  render() {
    return (
      <div>
      <Navbar color="faded" light expand="md">
        <NavbarBrand href="/" className="mr-auto">CIO DIALOG SYSTEM</NavbarBrand>
        <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
        <Collapse isOpen={!this.state.collapsed} navbar>
          <Nav navbar right="true" className="ml-auto">
            <NavItem>
              <NavLink>NLU</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
      
      {/* main container */}
      <Container>
        <Row>
          <Col>
            <Form onSubmit={this.handleUtterance}>
              <FormGroup>
                <Label for="utterance">Ask about flights</Label>
                <Input type="text" name="utterance" id="utterance" 
                  placeholder="show me all flights from Las Vegas to Atlanta" />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            NLU Response:
            <NLUResponse
              intent={this.state.nluResponse.intent}
              slots={this.state.nluResponse.slots}
            />
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}

export default App;
