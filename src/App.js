import React, { Component } from 'react';
import DropdownComponent from './dropdown-component.js';
import ThumbCard from './thumb-card.js'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
 
  render() {
    return (
      <div className="app">
       <DropdownComponent />
       <ThumbCard />
      </div>
    );
  }
}

export default App;
