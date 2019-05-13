import React, { Component } from "react";
import axios from "axios";
import { getApiUrl } from "../api";
const apiUrl = getApiUrl();

class LandingPage extends Component {
  state = {
    isLoggedIn: false,
    loginQR: "",
    rooms: []
  };
  componentDidMount() {}
  handleLogin = () => {
    axios.get(apiUrl + "/login").then(resp => {
      if (resp.data.data) {
        this.setState({ loginQR: resp.data.data });
      }
    });
  };
  handleGetRoomsList = () => {
    axios.get(apiUrl + "/rooms").then(resp => {
      this.setState({ rooms: resp.data.data });
    });
  };
  render() {
    const { loginQR, isLoggedIn, rooms } = this.state;
    return (
      <div>
        <div className="login-container">
          <div className="qr-container">
            <img src={loginQR} alt="qr" />
          </div>
          <div className="button-container">
            <button onClick={this.handleLogin}>Login</button>
          </div>
        </div>
        <div className="rooms-container">
          {rooms.map(room => (
            <p>{room}</p>
          ))}
        </div>
        <button onClick={this.handleGetRoomsList}>get rooms</button>
      </div>
    );
  }
}

export default LandingPage;
