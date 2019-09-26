import React, { Component } from 'react';
import './dialog.css';


function Message(props) {

  if (props.isMe === true)
    return (
      <div className="row justify-content-end">
        <div className="card message-card bg-lightblue m-1">
            <div className="card-body p-2">
                <span className="mx-2">{props.value}</span>
            </div>
        </div>
      </div>
    );
  return (
    <div className="row">
      <div className="card message-card m-1">
          <div className="card-body p-2">
              <span className="mx-2">{props.value}</span>
          </div>
      </div>
    </div>
  )
}

class MessageList extends Component {
  constructor(props) {
    super(props);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  
  componentDidMount() {
    this.scrollToBottom();
  }
  
  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    const objMessages = this.props.messages
    let messageList = objMessages.map((message, idx) => 
      <Message value={message.text} isMe={message.isMe} key={idx}/>
    );
    return (
      <div className="container-fluid message-scroll">
        {messageList}
        <div style={{ float:"left", clear: "both" }}
            ref={(el) => { this.messagesEnd = el; }}>
        </div>
      </div>
    )
  }
}


class Dialog extends Component {
  constructor(props) {
    super(props);
    this.startUtt = "...";
    this.urlStr = 'https://cionlu.herokuapp.com/api/v1/nlu';  // 'http://localhost:5000/api/v1/nlu';

    this.handleUtteranceChange = this.handleUtteranceChange.bind(this);
    this.handleSubmitFrom = this.handleSubmitFrom.bind(this);

    this.state = {
      dialog: [],
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
      },
      utterance: ""
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
    let dialog = this.state.dialog;
    dialog.push({
      isMe: true,
      text: this.state.utterance
    });

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
        dialog.push({
          isMe: false,
          text: "bot: " + this.state.utterance
        });
        this.setState({
          nluResponse: response,
          dialog: dialog
        });

    })
    .catch(error => console.error('Error:', error));
  }

  render() {
    return (
      <div>
        <div className="container-fluid chat-container">
          <div className="row h-100">
            <div className="col d-flex p-0">
                <div className="card">
                    <div className="card-header bg-darkblue text-white py-1 px-2">
                        <div className="d-flex flex-row justify-content-start">
                            <div className="col-1 p-1">
                                <button className="btn text-white bg-darkblue p-0 hover-color-lightgray">
                                    <i className="fas fa-bars fa-2x"></i>
                                </button>
                            </div>
                            <div className="col">
                                <div className="my-0">
                                    <b>Active d</b>
                                </div>
                                <div className="my-0">
                                    <small>stats 0000</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body bg-lightgrey d-flex flex-column p-0">
                        <MessageList messages={this.state.dialog} />
                        <form onSubmit={this.handleSubmitFrom}>
                          <div className="form-group">
                            <input type="text" className="form-control" id="utterance" aria-describedby="utteranceHelp"
                              value={this.state.utterance}
                              onChange={this.handleUtteranceChange} 
                              placeholder={this.startUtt}
                            />
                          </div>
                          <button type="submit" className="btn btn-primary float-right">Send
                          {/* <i className="fab fa-telegram-plane fa-2x"></i> */}                    
                          </button>
                        </form>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dialog;
