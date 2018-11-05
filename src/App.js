import React, { Component } from 'react';
import axios from 'axios';

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
  Form, FormGroup, Label, Input
} from 'reactstrap';


class NLUResponse extends Component {

  render() {
    return (
      <div>
        <h4>Intent: <span className="badge badge-secondary"> {this.props.intent} </span></h4>
        <p>Slots:</p>
        <ul>
          {this.props.slots.map((slot, idx) => {
            return (<li key={idx}><h4> {slot[0]} <span className="badge badge-secondary"> {slot[1]} </span></h4></li>)
          })}
        </ul>
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleUtteranceChange = this.handleUtteranceChange.bind(this);
    this.handleSubmitFrom = this.handleSubmitFrom.bind(this);

    this.state = {
      collapsed: true,
      nluResponse: {
        pred_slot_seq: "test",
        pred_intent_label: "test",
        pred_slot_labels: [
          ["slot0", "utt_word"],
          ["slot1", "utt_word"]
        ]
      },
      utterance: ""
    };
  }

  handleUtteranceChange(elem) {
    this.setState({utterance: elem.target.value})
  }

  handleSubmitFrom(elem) {
    elem.preventDefault();

    axios.post('http://127.0.0.1:5000/api/v1/nlu', {
        "utterance": this.state.utterance
    })
    .then(function (response) {
      this.setState({nluResponse: response.data});
      console.log(this.state);
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    }); 
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
            <Form onSubmit={this.handleSubmitFrom}>
              <FormGroup>
                <Label for="utterance">Ask about flights</Label>
                <Input type="text" name="utterance" id="utterance"
                  value={this.state.utterance}
                  onChange={this.handleUtteranceChange} 
                  placeholder="show me all flights from Las Vegas to Atlanta" />
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            NLU Response:
            <NLUResponse
              intent={this.state.nluResponse.pred_intent_label}
              slots={this.state.nluResponse.pred_slot_labels}
            />
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}

export default App;
