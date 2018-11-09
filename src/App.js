import React, { Component } from 'react';
import './custom.css';
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
    let slots = {};
    let intent = this.props.intent.replace(/atis_/, '');
    this.props.slots.forEach(slot => {
      let slotType = slot[1].replace(/B-|I-/, '');
      let slotName = slot[0];
      if (slotType !== 'O') {
        if (slotType in slots)
          slots[slotType] += " " + slotName;
        else
          slots[slotType] = slotName;
      }
    });
    
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
                      <th>Name</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(slots).map(([type, name], idx) => {
                      return (
                      <tr key={idx}>
                        <td>{name}</td>
                        <td>{type}</td>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="0">
                      <td>{intent}</td>
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
    const urlStr = 'https://cionlu.herokuapp.com/api/v1/nlu';

    axios.get(urlStr, {
      params: {
        "utterance": this.state.utterance
      }
    })
    .then(function (response) {
      this.setState({nluResponse: response.data});
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    }); 

    // let url = new URL(urlStr);
    // let params = {utterance: this.state.utterance};
    // url.search = new URLSearchParams(params);

    // fetch(url, {
    //   method: 'GET',
    //   mode: 'cors'
    // })
    // .then(res => {
    //   if (res.status !== 200)
    //     return undefined
    //   return res.json();
    // })
    // .then(response => {
    //   if (response)
    //     this.setState({nluResponse: response})
    // })
    // .catch(error => console.error('Error:', error));
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  componentDidMount() {
    
    let utt = "i'd like a flight on july ninth from orlando to kansas city in the afternoon";
    this.setState({utterance: utt});
    
    const urlStr = 'https://cionlu.herokuapp.com/api/v1/nlu';

    axios.get(urlStr, {
      params: {
        "utterance": utt
      }
    })
    .then(function (response) {
      this.setState({nluResponse: response.data});
    }.bind(this))
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      // always executed
    }); 
    
    // let url = new URL('https://cionlu.herokuapp.com/api/v1/nlu');
    // let params = {utterance: utt};
    // url.search = new URLSearchParams(params);

    // fetch(url, {
    //   method: 'GET'
    // })
    // .then(res => {
    //   if (res.status !== 200)
    //     return undefined
    //   return res.json();
    // })
    // .then(response => {
    //   if (response)
    //     this.setState({nluResponse: response})
    // })
    // .catch(error => console.error('Error:', error));
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
            <h5>Ask about your flights</h5>
            <Form onSubmit={this.handleSubmitFrom}>
              <FormGroup>
                <Input type="textarea" name="utterance" id="utterance"
                  value={this.state.utterance}
                  onChange={this.handleUtteranceChange} 
                  placeholder="i'd like a flight on july ninth from orlando to kansas city in the afternoon" />
                <Button className="float-right submit-btn" color="primary" type="submit">Analyze</Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>NLU Responses</h5>
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
