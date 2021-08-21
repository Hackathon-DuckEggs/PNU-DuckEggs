import React from 'react';
import { Route } from 'react-router-dom';
import Analysis from './pages/analysis';
import Home from './pages/home';

const App = () => {
  return (
    <div>
      <Route path="/" exact={true} component={Home} />
      <Route path="/analysis/:key" component={Analysis} />
    </div>
  );
};

export default App;
