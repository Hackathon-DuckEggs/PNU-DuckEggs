import React from 'react';
import { Route } from 'react-router-dom';
import Analysis from './pages/analysis';
import Home from './pages/home';
import Footer from './components/footer';
import Test from './pages/test';

// <Route path="/analysis/:key" component={Analysis} />

const App = () => {
  return (
    <div>
      <Route path="/" exact={true} component={Home} />
      <Route path="/analysis/:key" component={Analysis} />
      <Route path="/test" component={Test} />
      <Footer />
    </div>
  );
};

export default App;
