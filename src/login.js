import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginToast: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(event) {
    event.preventDefault()

    const axios = this.props.axios;

    if (this.props.username === "" || this.props.token === "") {
      this.setState({
        loginToast: "Username and Token are required."
      });
      return;
    }

    axios.defaults.headers.common['Pinboard-Auth'] = this.props.username + ":" + this.props.token;

    axios.get("/auth/test")
    .then((res) => {
      this.setState({
        loginToast: "Success"
      });
      this.props.handleLoginChange(true);
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        this.setState({
          loginToast: "Authentication failed"
        });
      } else {
        this.setState({
          loginToast: "Error from server: " + error.message + ". Try again later.",
        });
      }
    });
      
  }

  render() {
    return(
      <div class="login">
        <form onSubmit={this.handleSubmit}>
          <p>
          </p>
          <p>
            <label>Username:</label>
            <input name="username" type="text" value={this.props.username} onChange={this.props.handleChange}/>
          </p>
          <p>
            <label>Token:</label>
            <input name="token" type="text" value={this.props.token} onChange={this.props.handleChange}/>
          </p>
          <p>
            <label></label>
            <input type="submit" value="login" />
          </p>
        </form>
        <br />
        <span class="login-toast">{this.state.loginToast}</span>
      </div>
    )
  }
}

export default Login;
