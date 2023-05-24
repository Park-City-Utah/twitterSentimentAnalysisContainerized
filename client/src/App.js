import React from "react";
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom'
import OtherPage from './OtherPage';
import Fib from './Fib';
//import Func from './Func';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to my --NLP Sentiment Analysis-- App</h1>
        
        <Link to="/">Home</Link>
        <Link to="/otherpage">Other Page</Link>
      </header>
      <div>
          {/* <Route exact path="/" component={Func} /> */}
          <Route exact path="/" component={Fib} />
          <Route path="/otherpage" component={OtherPage} />
      </div>
    </div>
    </Router>
  );
}

export default App;
