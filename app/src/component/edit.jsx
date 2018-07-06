import React from 'react';
import Api from '../api';

export default class Edit extends React.Component {
    constructor(props) {
        super(props);

        Api.getProject(this.props.application.getToken(), this.props.match.params.name)
            .then(project => Api.getAccount(this.props.application.getToken())
                .then((account) => {
                    if (project.owner_id === account.id) {
                        this.setState({ project, account });
                    } else {
                        this.setState({ error: 'You are not the owner of this project.' });
                    }
                }))
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    updateMeta(event) {
        event.preventDefault();

        const description = this.refs.description.value;
        const runtime = this.refs.runtime.value;

        Api.updateProject(
            this.props.application.getToken(),
            this.state.project.name,
            description,
            runtime,
        )
            .then(({ error }) => {
                if (error) {
                    this.setState({ error });
                }
            })
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    delete() {
        Api.deleteProject(this.props.application.getToken(), this.state.project.name)
            .then(() => {
                this.props.application.history.push('/');
            })
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    render() {
        return this.state ? (
            <div className="container">
                <h1>Edit</h1>

                {this.state.error ? (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error :</strong> {this.state.error}
                    </div>
                ) : (
                    <form onSubmit={this.updateMeta.bind(this)}>
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" className="form-control" defaultValue={this.state.project.name} disabled="true" />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea className="form-control" ref="description" placeholder="Description...">
                                {this.state.project.description}
                            </textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Update</button>
                        <a className="btn btn-danger" onClick={this.delete.bind(this)}>Delete</a>
                    </form>
                )}
            </div>
        ) : (
            <div className="container">
                <h1>Edit</h1>
                <p>Loading...</p>
            </div>
        );
    }
}
