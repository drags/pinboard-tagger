import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Axios from 'axios';

//const ax = Axios.create()
//ax.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

class Tagger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  render() {
    return(
      <div class="tagger">
        <Login />
      </div>
    )
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      token: "",
      loginToast: "",
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    // submit login form with axios
    //  if 200
    //      api will create its own session cookie, change isLoggedIn and re-render
    //  else
    //      bitch in login form
    event.preventDefault()
    if (this.state.username === "" || this.state.token === "") {
      this.setState({
        loginToast: "Username and Token are required."
      });
      return;
    }

    const params = new URLSearchParams();
    params.append('username', this.state.username)
    params.append('token', this.state.token)
    console.log("Params")
    params.forEach((v,k) => {console.log(k,v)})
    console.log(params.values())

    Axios.post("http://localhost:4567/login",
      params,
    )
      .then(res => {
        console.log(res);
      });
  }


  render() {
    return(
      <div class="login">
        <form onSubmit={this.handleSubmit}>
          <span class="login-toast">{this.state.loginToast}</span>
          <p>
            <label>Username:</label>
            <input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
          </p>
          <p>
            <label>Token:</label>
            <input name="token" type="text" value={this.state.token} onChange={this.handleChange}/>
          </p>
          <p>
            <label></label>
            <input type="submit" value="login" />
          </p>
        </form>
      </div>
    )
  }
}

ReactDOM.render(<Tagger />, document.getElementById('root'));
