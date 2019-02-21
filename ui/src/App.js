import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { output: "Begin" };

    this.getAll = this.getAll.bind(this);
  }


  getAll() {
    fetch('/api/get')
    .then(response => response.text())
    .then(data => this.setState({ output: data }));  
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>{this.state.output}</p>
          <button onClick={this.getAll}>Get all</button>
        </header>
      </div>
    );
  }
}

export default App;
