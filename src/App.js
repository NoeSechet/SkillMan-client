import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Login from './authentication/Login.js';
import Register from './authentication/Register.js';
import Home from './Home.js';

import './App.css';

function App() {
    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/home" component={Home} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;