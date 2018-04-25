import React from 'react';
import createHistory from 'history/createBrowserHistory';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import Home from './component/home';
import Login from './component/login';
import Register from './component/register';
import Account from './component/account';
import Create from './component/create';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.history = createHistory();
        this.state = { token: localStorage.getItem('token') };
    }

    getToken() {
        return this.state.token;
    }

    updateToken(token) {
        this.setState({ token });
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
        this.history.push('/');
    }

    logout() {
        this.updateToken(undefined);
    }

    render() {
        return (
            <div className="app">
                <Router history={this.history}>
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <a className="navbar-brand" href="#">Spring Camp Platform</a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbar">
                                {this.getToken() ? (
                                    <ul className="navbar-nav mr-auto">
                                        <li className="nav-item">
                                            <Link to='/home' className='nav-link'>Home</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to='/account' className='nav-link'>Account</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to='/create' className='nav-link'>Create</Link>
                                        </li>
                                        <li className="nav-item">
                                            <a onClick={this.logout.bind(this)} className='nav-link'>Logout</a>
                                        </li>
                                    </ul>
                                ) : (
                                    <ul className="navbar-nav mr-auto">
                                        <li className="nav-item">
                                            <Link to='/login' className='nav-link'>Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to='/register' className='nav-link'>Register</Link>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </nav>

                        {this.getToken() ? (
                            <Switch>
                                <Redirect exact path='/' to='/home' />
                                <Route path='/home' render={() => <Home application={this} />} />
                                <Route path='/account' render={() => <Account application={this} />} />
                                <Route path='/create' render={() => <Create application={this} />} />
                            </Switch>
                        ) : (
                            <Switch>
                                <Redirect exact path='/' to='/login' />
                                <Route path='/login' render={() => <Login application={this} />} />
                                <Route path='/register' render={() => <Register application={this} />} />
                            </Switch>
                        )}
                    </div>
                </Router>
            </div>
        );
    }
}
