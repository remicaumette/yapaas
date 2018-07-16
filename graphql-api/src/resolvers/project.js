import Project from '../model/project';
import User from '../model/user';
import { getPort } from '../deployer';

export async function owner({ id }) {
    const project = await Project.findOne({ where: { id } });
    const user = await User.findById(project.userId);

    return user.serialize();
}

export async function url({ id }) {
    const port = await getPort(id);
    return port ? `http://${process.env.BASE_URL || 'localhost'}:${port}` : null;
}
