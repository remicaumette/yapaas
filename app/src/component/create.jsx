import React from 'react';
import Api from '../api';

export default class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    onSubmit(event) {
        event.preventDefault();

        const name = this.refs.name.value;
        const description = this.refs.description.value;
        const file = this.refs.file.files;

        Api.createProject(this.props.application.getToken(), name, description)
            .then((res) => {
                if (res.error) {
                    return this.setState({ error: res.error });
                }
                return Api.updateProject(this.props.application.getToken(), name, file)
                    .then(() => this.props.application.history.push('/'));
            })
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    render() {
        return (
            <div className="container">
                <h1>Create new project</h1>

                {this.state.error && <div className="alert alert-danger" role="alert">
                    <strong>Error :</strong> {this.state.error}
                </div>}

                <form onSubmit={this.onSubmit.bind(this)}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" ref="name" placeholder="Name" />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" ref="description" placeholder="Description...">
                        </textarea>
                    </div>
                    <div className="form-group">
                        <label>File</label>
                        <input type="file" className="form-control" ref="file" />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
        );
    }
}
