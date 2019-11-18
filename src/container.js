import React from 'react';
import Login from './login.js';
import Tagger from './tagger.js';
import Axios from 'axios';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: "",
      token: "",
      axios: Axios.create({
        baseURL: "http://localhost:4567/",
      }),
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
        <Tagger
          axios={this.state.axios}
        />
      );
    } else {
      return(
        <Login
          handleChange={this.handleChange}
          handleLoginChange={this.handleLoginChange}
          username={this.state.username}
          token={this.state.token}
          axios={this.state.axios}
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
