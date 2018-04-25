import React from 'react';
import Api from '../api';

export default class Account extends React.Component {
    constructor(props) {
        super(props);

        Api.getAccount(this.props.application.getToken())
            .then((res) => {
                this.setState({ account: res });
            })
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    onSubmit(event) {
        event.preventDefault();

        const description = this.refs.description.value;

        Api.updateAccount(this.props.application.getToken(), description)
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    render() {
        return this.state ? (
            <div className="container">
                <h1>Account</h1>

                {this.state.error ? (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error :</strong> {this.state.error}
                    </div>
                ) : (
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <div className="form-group">
                            <label>Email address</label>
                            <input type="email" className="form-control" defaultValue={this.state.account.email} disabled="true" />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" className="form-control" defaultValue={this.state.account.username} disabled="true" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea className="form-control" ref="description" placeholder="Description...">
                                {this.state.account.description}
                            </textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Update</button>
                    </form>
                )}
            </div>
        ) : (
            <div className="container">
                <h1>Account</h1>
                <p>Loading...</p>
            </div>
        );
    }
}
