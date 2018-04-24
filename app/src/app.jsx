import React from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Home from './component/home';
import Login from './component/login';

export default class App extends React.Component {
    render() {
        return (
            <div className="app">
                <BrowserRouter >
                    <div>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">
                            <a className="navbar-brand" href="#">Navbar</a>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item">
                                        <Link to='/' className='nav-link'>Home</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/login' className='nav-link'>Login</Link>
                                    </li>
                                </ul>
                            </div>
                        </nav>

                        <Route exact path='/' component={Home} />
                        <Route path='/login' component={Login} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
