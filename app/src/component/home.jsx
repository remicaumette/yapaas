import React from 'react';
import { Link } from 'react-router-dom';
import Api from '../api';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        Api.listProjects(this.props.application.getToken())
            .then(projects => Api.getAccount(this.props.application.getToken())
                .then((account) => {
                    this.setState({ projects, account });
                }))
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
                                    <td>
                                        {project.port ? <a href={`http://${Api.getIp()}:${project.port}`} target="__blank">Click here</a> : 'Unavailable'}
                                        {this.state.account.id === project.owner_id ? (<span> | <Link to={`/edit/${project.name}`}>Edit</Link></span>) : ''}
                                    </td>
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
