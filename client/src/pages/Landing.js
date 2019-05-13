import React, { Component } from "react";
import axios from "axios";
import { getApiUrl } from "../api";
const apiUrl = getApiUrl();

class LandingPage extends Component {
  state = {
    isLoggedIn: false,
    loginQR: ""
  };
  componentDidMount() {}
  handleLogin = () => {
    axios.get(apiUrl + "/login").then(resp => {
      console.log(resp.data.data);
      this.setState({ loginQR: resp.data.data });
    });
  };
  render() {
    const { loginQR, isLoggedIn } = this.state;
    return (
      <div>
        <div className="qr-container">
          <img src={loginQR} alt="qr" />
        </div>
        <div className="button-container">
          <button onClick={this.handleLogin}>Login</button>
        </div>
      </div>
    );
  }
}

export default LandingPage;
