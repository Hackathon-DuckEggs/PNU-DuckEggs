import React from "react";
import { Route } from "react-router-dom";
import Analysis from "./pages/analysis";
import Home from "./pages/home";
import Review from "./pages/review";
import Versus from "./pages/versus";
import VersusLoading from "./pages/versusLoading";

const App = () => {
  return (
    <React.StrictMode>
      <div>
        <Route path="/" exact={true} component={Home} />
        <Route path="/analysis/:key" component={Analysis} />
        <Route path="/review/:key" component={Review} />
        <Route path="/versus/" exact={true} component={Versus} />
        <Route path="/versus/:key" exact={true} component={Versus} />
        <Route path="/loading/" exact={true} component={VersusLoading} />
      </div>
    </React.StrictMode>
  );
};

export default App;
