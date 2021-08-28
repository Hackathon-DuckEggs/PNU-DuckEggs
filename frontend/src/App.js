import React from "react";
import { Route } from "react-router-dom";
import Analysis from "./pages/analysis";
import Home from "./pages/home";
import Test from "./pages/test";
import Review from "./pages/review";

const App = () => {
  return (
    <React.StrictMode>
      <div>
        <Route path="/" exact={true} component={Home} />
        <Route path="/analysis/:key" component={Analysis} />
        <Route path="/test" component={Test} />
        <Route path="/review/:key" component={Review} />
      </div>
    </React.StrictMode>
  );
};

export default App;
