import React, { Component } from 'react';
import './custom.css';

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
  Table,
  Form, FormGroup, Input, Button, TabContent, TabPane
} from 'reactstrap';
import classnames from 'classnames';


class NLUResponse extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    let entities = this.props.entities || []
    return (
      <div>
        <p></p>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
              href="#"
            >
            Entities
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
              href="#"
            >
            Intention
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Value</th>
                      <th>Type Name</th>
                      <th>Confidence Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entities.map((entity, idx) => {
                      return (
                      <tr key={idx}>
                        <td>{entity.entity_value}</td>
                        <td>{entity.entity_type}</td>
                        <td>{parseFloat(entity.confidence_score).toFixed(3)}</td>
                      </tr>)
                    })}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Confidence Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="0">
                      <td>{this.props.intent.intent_type}</td>
                      <td>{parseFloat(this.props.intent.confidence_score).toFixed(3)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.startUtt = "please show me flights from pittsburgh to new york city on wednesday morning serving breakfast";

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.handleUtteranceChange = this.handleUtteranceChange.bind(this);
    this.handleSubmitFrom = this.handleSubmitFrom.bind(this);

    this.state = {
      collapsed: true,
      nluResponse: {
        "entities": [
          {
            "confidence_score": 0.0,
            "end": null,
            "entity_type": "t1",
            "entity_value": "slot1",
            "start": null
          }
        ],
        "intent": {
            "confidence_score": 0.0,
            "intent_type": "t1"
        },
        text: ""
      }
    };
  }

  handleUtteranceChange(elem) {
    let utt = elem.target.value;
    // check if enter was hitted
    if (utt.charAt(utt.length-1) === '\n')
      this.handleSubmitFrom(elem);
    else
      this.setState({utterance: elem.target.value});
  }

  handleSubmitFrom(elem) {
    elem.preventDefault();
    const urlStr = 'https://cionlu.herokuapp.com/api/v1/nlu';
    // const urlStr = 'http://localhost:5000/api/v1/nlu';

    let url = new URL(urlStr);
    let params = {utterance: this.state.utterance};
    url.search = new URLSearchParams(params);

    fetch(url, {
      method: 'GET',
      mode: 'cors'
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
    
    this.setState({utterance: this.startUtt});

    // const urlStr = 'https://cionlu.herokuapp.com/api/v1/nlu';
    const urlStr = 'http://localhost:5000/api/v1/nlu';
    let url = new URL(urlStr);
    let params = {utterance: this.startUtt};
    url.search = new URLSearchParams(params);

    fetch(url, {
      method: 'GET'
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
        <NavbarBrand href="/" className="mr-auto brand-title">CIO Dialog System</NavbarBrand>
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
      <Container className="nlu-content">
        <Row>
          <Col>
            <h5>State something</h5>
            <Form onSubmit={this.handleSubmitFrom}>
              <FormGroup>
                <Input type="textarea" name="utterance" id="utterance"
                  value={this.state.utterance}
                  onChange={this.handleUtteranceChange} 
                  placeholder={this.startUtt} 
                  />
                <Button className="float-right submit-btn" color="primary" type="submit">Analyze</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>See Language Understanding in action</h5>
            <NLUResponse
              intent={this.state.nluResponse.intent}
              entities={this.state.nluResponse.entities}
            />
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}

export default App;
