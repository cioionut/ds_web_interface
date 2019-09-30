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
    this.serverNotAvailableMsg = "Incerc sa stabilesc conexiunea cu serverul de dialog, incearca te rog peste cateva momente";
    this.welcomeMsg = "Buna! Eu sunt EnelBot, asistentul tau virtual. Te pot ajuta cu trimiterea facturii curente sau cu actualizarea indexului. Scrie-mi daca ai nevoie de mine!"
    this.sessionExpiredMsg = "Din cauza inactivitatii sesiunea de dialog s-a incheiat, voi deschide o noua conversatie."
    this.restoreSessionWelcomeMsg = "Bine ai revenit! Te pot ajuta cu trimiterea facturii curente sau cu actualizarea indexului. Scrie-mi daca mai ai nevoie de mine!"

    this.startUtt = "...";
    let host = 'http://0.0.0.0:5000';
    // let host = 'https://cio-dialogsys.herokuapp.com';
    this.apiUrl = `${host}/api/v1`;
    this.handleUtteranceChange = this.handleUtteranceChange.bind(this);
    this.handleSubmitFrom = this.handleSubmitFrom.bind(this);

    this.state = {
      dialog: [],
      apiResponse: {},
      utterance: "",
      sessionId: ""
    };
  }

  componentDidMount() {
    let url = new URL(this.apiUrl + "/sessions");

    fetch(url, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors'
    })
    .then(res => {
      if (res.status !== 200)
        return undefined
      return res.json();
    })
    .then(response => {   
      if (response) {
        this.setState(state => {
          let new_dialog = [...state.dialog]
          new_dialog.push({
            isMe: false,
            text: this.welcomeMsg
          })
          return {
            sessionId: response.session_id,
            dialog: new_dialog
          }
        });
      }
    })
    .catch(error => {
      this.setState(state => {
        let new_dialog = [...state.dialog]
        new_dialog.push({
          isMe: false,
          text: this.serverNotAvailableMsg
        })
        return {
          dialog: new_dialog
        }
      });
      console.error('Error:', error)
    });
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
    this.setState({utterance: ""})

    let url = new URL(`${this.apiUrl}/${this.state.sessionId}/message`);
    // add user utterance to dialog list
    this.setState(state => {
      let new_dialog = [...state.dialog] 
      new_dialog.push({
        isMe: true,
        text: this.state.utterance
      });
      return { dialog: new_dialog }
    });

    let payload = {
      "input": {
        "text": this.state.utterance
      }
    }
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      mode: 'cors'
    })
    .then(res => {
      if (res.status !== 200) {
        if (res.status === 404) {
          // session has expired
          this.setState(state => {
            let new_dialog = [...state.dialog]
            new_dialog.push({
              isMe: false,
              text: this.sessionExpiredMsg
            });
            return { dialog: new_dialog }
          });
          // create a new session
          let url = new URL(this.apiUrl + "/sessions");
          fetch(url, {
            method: 'POST',
            credentials: 'include',
            mode: 'cors'
          })
          .then(res => {
            if (res.status !== 200)
              return undefined
            return res.json();
          })
          .then(response => {      
            if (response) {
              this.setState(state => {
                let new_dialog = [...state.dialog]
                new_dialog.push({
                  isMe: false,
                  text: this.restoreSessionWelcomeMsg
                });
                return {
                  sessionId: response.session_id,
                  dialog: new_dialog
                }
              });
            }
          })
          .catch(error => {
            this.setState(state => {
              let new_dialog = [...state.dialog]
              new_dialog.push({
                isMe: false,
                text: this.serverNotAvailableMsg
              });
              return {dialog: new_dialog}
            });
            console.error('Error:', error)
          });          
        }
        return undefined
      }
      return res.json();
    })
    .then(response => {      
      if (response)  {
        this.setState(state => {
          let new_dialog = [...state.dialog]
          new_dialog.push({
            isMe: false,
            text: response.output
          });
          return {
            apiResponse: response,            
            dialog: new_dialog
          }
        });        
      }
    })
    .catch(error => {
      this.setState(state => {
        let new_dialog = [...state.dialog]
        new_dialog.push({
          isMe: false,
          text: this.serverNotAvailableMsg
        })
        return {
          dialog: new_dialog
        }
      });
      console.error('Error:', error)
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div className="col">
                <div className="card">
                    <div className="card-header">
                      <h5>My Virtual Asisstant</h5>
                    </div>
                    <div className="card-body d-flex flex-column p-1">
                        <MessageList messages={this.state.dialog} />
                        <form onSubmit={this.handleSubmitFrom} className="mt-3 p-1">
                          <div className="input-group">
                            <input type="text" className="form-control" id="utterance" autoComplete="off"
                              value={this.state.utterance}
                              onChange={this.handleUtteranceChange} 
                              placeholder={this.startUtt}
                            />
                            <div className="input-group-prepend">
                              <button type="submit" className="btn btn-primary">Send</button>
                            </div>
                          </div>
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
