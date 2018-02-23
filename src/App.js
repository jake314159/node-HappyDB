import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        text: "Some example text"
      }
    }
    this.updateData = this.updateData.bind(this);
  }
  componentDidMount() {
    this.updateData();
  }
  updateData() {
    var self = this;
    this.setState({
      data: {
        text: "Some more text"
      }
    });

    fetch('http://localhost:8080/happy').then(function(response) {
      console.log(response);
      response.json().then(function(data) {
        console.log(data);
        self.setState({
          data: data.data
        });
      });
    })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.data.text}</h1>
        </header>
        <p className="App-cite">
          Akari Asai, Sara Evensen, Behzad Golshan, Alon Halevy, Vivian Li, Andrei Lopatenko, 
Daniela Stepanov, Yoshihiko Suhara, Wang-Chiew Tan, Yinzhan Xu, 
``HappyDB: A Corpus of 100,000 Crowdsourced Happy Moments'', LREC '18, May 2018. (to appear)
        </p>
      </div>
    );
  }
}

export default App;
