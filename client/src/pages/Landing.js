import React, { Component } from "react";
import axios from "axios";
import { getApiUrl } from "../api";
const apiUrl = getApiUrl();

class LandingPage extends Component {
  state = {
    isLoggedIn: false,
    isRoomReady: false,
    isMessageInProcess: false,
    loginQR: "",
    rooms: [],
    msg: "",
    timeout: "",
  };
  componentDidMount() {
    this.pollForLoginState();
  }
  handleLogin = () => {
    axios.get(apiUrl + "/qr").then(resp => {
      if (resp.data.data) {
        this.setState({ loginQR: resp.data.data });
      }
    });
  };
  handleGetRoomsList = () => {
    setTimeout(() => {
      axios.get(apiUrl + "/rooms").then(resp => {
        if (resp.data.isRoomReady) {
          console.log('is ready')
          this.setState({ rooms: resp.data.data, isRoomReady: true });
        } else {
          this.handleGetRoomsList()
        }
      });  
    }, 3000);
    
  };
  handleInputChange = e => {
    this.setState({ msg: e.target.value });
  };
  handleTimeoutChange = e => {
    this.setState({ timeout: e.target.value });
  };
  handleSendMassMessage = () => {
    this.setState({
      isMessageInProcess: true
    }, () => {
      axios
        .get(apiUrl + "/rooms/send", {
          params: { msg: this.state.msg, timeout: this.state.timeout || 1 }
        })
        .then(resp => {
          if (resp.data.data) {
            this.setState({ msg: "", isMessageInProcess: false }, () => {
              alert('全部信息发送完成')
            });
          }
        });
    })
  };
  pollForLoginState = () => {
    setTimeout(() => {
      axios.get(apiUrl + "/login").then(resp => {
        if (resp.data.data) {
          this.setState({ isLoggedIn: true }, () => {
            this.handleGetRoomsList();
          });
        } else {
          this.setState({ isLoggedIn: false });
          this.pollForLoginState();
        }
      });
    }, 1000);
  };
  render() {
    const { loginQR, isLoggedIn, isMessageInProcess, isRoomReady, rooms, msg, timeout } = this.state;
    return (
      <div>
        {!isLoggedIn && (
          <div className="login-container">
            <div className="qr-container">
              <img src={loginQR} alt="qr" />
            </div>
            <div className="button-container">
              <button onClick={this.handleLogin}>Login</button>
            </div>
          </div>
        )}
        {
          isLoggedIn && !isRoomReady && '正在加载中...'
        }
        {
          isRoomReady && <div className="rooms-container">
          <h2>所有可獲取群聊</h2>
          {rooms.map((room, i) => (
            <p key={i}>
              {i + 1}. {room}
            </p>
          ))}
        </div>
        }
        {
          isMessageInProcess ? 
          '消息正在发送中，请勿刷新页面' :
          (
            <div className="msg-form-container">
              <input
                type="number"
                placeholder="間隔/秒 (默認1秒)"
                onChange={this.handleTimeoutChange}
                value={timeout}
              />
              <input
                placeholder="群發消息文本"
                type="text"
                onChange={this.handleInputChange}
                value={msg}
              />
              <button onClick={this.handleSendMassMessage}>send msg</button>
            </div>
          )
        }
      </div>
    );
  }
}

export default LandingPage;
