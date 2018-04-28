import React from 'react';
import Api from '../api';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        Api.listProjects(this.props.application.getToken())
            .then((res) => {
                this.setState({ projects: res });
            })
            .catch(() => {
                this.setState({ error: 'An error occurred. Please retry later.' });
            });
    }

    render() {
        return this.state ? (
            <div className="container">
                <h1>Home</h1>

                {this.state.error ? (
                    <div className="alert alert-danger" role="alert">
                        <strong>Error :</strong> {this.state.error}
                    </div>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Description</th>
                                <th scope="col">Url</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.projects.map(project => (
                                <tr key={project.id}>
                                    <td>{project.name}</td>
                                    <td>{project.description}</td>
                                    <td>{project.port ? <a href={`http://10.101.53.215:${project.port}`} target="__blank">Click here</a> : 'Unavailable'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        ) : (
            <div className="container">
                <h1>Home</h1>
                <p>Loading...</p>
            </div>
        );
    }
}
