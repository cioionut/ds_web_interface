import React, { Component } from 'react';

import NLUResponse from '../nluresponse/nluresponse'
import {
  Container,
  Row,
  Col,
  Form, FormGroup, Input, Button
} from 'reactstrap';

import './nlu.css';

class NLU extends Component {
  constructor(props) {
    super(props);
    this.startUtt = "please show me flights from pittsburgh to new york city on wednesday morning serving breakfast";
    this.urlStr = 'https://cionlu.herokuapp.com/api/v1/nlu';  // 'http://localhost:5000/api/v1/nlu';

    this.handleUtteranceChange = this.handleUtteranceChange.bind(this);
    this.handleSubmitFrom = this.handleSubmitFrom.bind(this);

    this.state = {
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

    let url = new URL(this.urlStr);
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

  componentDidMount() {
    
    this.setState({utterance: this.startUtt});

    let url = new URL(this.urlStr);
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

export default NLU;
