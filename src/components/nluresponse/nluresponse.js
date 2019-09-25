import React, { Component } from 'react';

import {
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  Table,
  TabContent, TabPane
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

export default NLUResponse;
