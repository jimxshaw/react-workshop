////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - Create a chat application using the utility methods we give you
//
// Need some ideas?
//
// - Cause the message list to automatically scroll as new
//   messages come in
// - Highlight messages from you to make them easy to find
// - Highlight messages that mention you by your GitHub username
// - Group subsequent messages from the same sender
// - Create a filter that lets you filter messages in the chat by
//   sender and/or content
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import {render} from 'react-dom'
import {login, sendMessage, subscribeToMessages} from './utils/ChatUtils'
import './styles'

/*
Here's how to use the ChatUtils:

login((error, auth) => {
  // hopefully the error is `null` and you have a auth.github object
})

sendMessage(
  auth.uid,                       // the auth.uid string
  auth.github.username,           // the username
  auth.github.profileImageURL,    // the user's profile image
  'hello, this is a message'      // the text of the message
)

const unsubscribe = subscribeToMessages(messages => {
  // here are your messages as an array, it will be called
  // every time the messages change
})

unsubscribe() // stop listening for new messages

The world is your oyster!
*/

class Chat extends React.Component {
  state = {
    auth: null,
    messages: []
  };

  componentDidMount() {
    login((error, auth) => {
      this.setState({auth: auth});
    });

    subscribeToMessages(messages => {
      this.setState({messages: messages});
    })
  }

  componentDidUpdate() {
    this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const {auth} = this.state;
    const messageText = this.messageInput.value;

    if ((/\S/).test(messageText)) {
      sendMessage(
        auth.uid,                       // the auth.uid string
        auth.github.username,           // the username
        auth.github.profileImageURL,    // the user's profile image
        messageText                     // the text of the message
      );

      // Clear the form.
      event.target.reset()
    }

  };

  render() {
    const {auth, messages} = this.state;

    if (auth == null) {
      return <p>Loading...</p>
    }

    return (
      <div className="chat">
        <header className="chat-header">
          <h1 className="chat-title">HipReact</h1>
          <p className="chat-message-count"># messages: {this.state.messages.length}</p>
        </header>
        <div className="messages" ref={node => this.scroller = node}>
          <ol className="message-groups">
            {this.state.messages.map((message, index) => (
              <li key={index} className="message-group">
                <div className="message-group-avatar">
                  <img src={message.avatarURL}/>
                </div>
                <ol className="messages">
                  <li className="message">{message.text}</li>
                </ol>
              </li>
            ))}
          </ol>
        </div>
        <form className="new-message-form" onSubmit={this.handleSubmit}>
          <div className="new-message">
            <input ref={node => this.messageInput = node} type="text" placeholder="say something..."/>
          </div>
        </form>
      </div>
    )
  }
}

render(<Chat/>, document.getElementById('app'))
