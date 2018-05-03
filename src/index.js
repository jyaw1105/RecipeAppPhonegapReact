import './css/index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { Route, HashRouter,Link } from 'react-router-dom';
import Home from './components/Home';
import Detail from './components/Detail';
import Edit from './components/Edit';
import Add from './components/Add';

const App = React.createClass({
  getInitialState() {
    //return StepStore.getState();
    return {
      animationName: 'push',
    }
  },
  componentWillMount() {
    // Lifecycle function that is triggered just before a component mounts
  },
  componentWillUnmount() {
    // Lifecycle function that is triggered just before a component unmounts
  },
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path={"/"} component={Home}/>
          <Route path={"/detail"} component={Detail}/>
          <Route path={"/edit"} component={Edit}/>
          <Route path={"/add"} component={Add}/>
        </div>
      </HashRouter>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
