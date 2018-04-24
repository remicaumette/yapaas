import React from 'react';
import Api from '../api';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSubmit(event) {
        event.preventDefault();

        const email = this.refs.email.value;
        const password = this.refs.password.value;

        Api.login(email, password)
            .then((res) => {
                if (res.token) {
                    this.props.application.updateToken(res.token);
                } else {
                    this.setState({ error: res.error });
                }
            })
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    render() {
        return (
            <div className="container">
                <h1>Login</h1>

                {this.state.error && <div className="alert alert-danger" role="alert">
                    <strong>Error :</strong> {this.state.error}
                </div>}

                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        <label>Email address</label>
                        <input type="email" className="form-control" ref="email" placeholder="Email address"/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control" ref="password" placeholder="Password"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}