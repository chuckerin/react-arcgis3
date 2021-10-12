import React from 'react';
import BaseModuleMap from './components/base-module-map';
import BaseCoreMap from './components/base-core-map';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div id="viewDiv" style={{ height: '100vh', width: '100vw' }}>
        <BaseCoreMap />
      </div>
    );
  }
}

export default App;
