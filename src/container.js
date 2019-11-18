import React from 'react';
import Login from './login.js';
import Tagger from './tagger.js';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: "",
      token: "",
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleLoginChange = this.handleLoginChange.bind(this)
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleLoginChange(loggedIn) {
    this.setState({
      loggedIn: loggedIn
    });
  }

  renderTagger(props) {
    if (this.state.loggedIn) {
      return(
        <Tagger />
      );
    } else {
      return(
        <Login
          handleChange={this.handleChange}
          handleLoginChange={this.handleLoginChange}
          username={this.state.username}
          token={this.state.token}
        />
      );
    }
  }

  render() {
    return(
      <div class="container">
        {this.renderTagger()}
      </div>
    )
  }
}


export default Container;
