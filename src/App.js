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
  Form, FormGroup, Label, Input, Button
} from 'reactstrap';


class NLUResponse extends Component {

  render() {
    const slots = this.props.slots.filter((slot, idx) => slot[1] !== "O")
    return (
      <div>
        <h4>Intent: <span className="badge badge-secondary"> {this.props.intent} </span></h4>
        <p>Slots:</p>
        <ul>
          {slots.map((slot, idx) => {
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
        pred_slot_labels_str: "test",
        pred_intent_label: "test",
        pred_slot_labels: [
          ["slot0", "utt_word"],
          ["slot1", "utt_word"]
        ],
        message: ""
      },
      utterance: ""
    };
  }

  handleUtteranceChange(elem) {
    this.setState({utterance: elem.target.value})
  }

  handleSubmitFrom(elem) {
    elem.preventDefault();
    let url = new URL('https://cionlu.herokuapp.com/api/v1/nlu')

    let params = {utterance: this.state.utterance}    ;
    url.search = new URLSearchParams(params)

    fetch(url, {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200)
        return undefined
      return res.json();
    })
    .then(response => {
      if (response)
        this.setState({nluResponse: response})
    })
    .catch(error => console.error('Error:', error));
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  componentDidMount() {
    
    let utt = "i'd like a flight on july ninth from orlando to kansas city in the afternoon";
    this.setState({utterance: utt});
    let url = new URL('https://cionlu.herokuapp.com/api/v1/nlu');

    let params = {utterance: utt};
    url.search = new URLSearchParams(params);

    fetch(url, {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status !== 200)
        return undefined
      return res.json();
    })
    .then(response => {
      if (response)
        this.setState({nluResponse: response})
    })
    .catch(error => console.error('Error:', error));
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
                <Input type="textarea" name="utterance" id="utterance"
                  value={this.state.utterance}
                  onChange={this.handleUtteranceChange} 
                  placeholder="i'd like a flight on july ninth from orlando to kansas city in the afternoon" />
                <Button color="info" type="submit">Send</Button>
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
