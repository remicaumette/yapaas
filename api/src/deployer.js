const { promises: fs } = require('fs');
const { join } = require('path');
const { tmpdir } = require('os');
const { v4: uuid } = require('uuid');
const { info } = require('signale');
const Docker = require('dockerode');
const decompress = require('decompress');

const docker = new Docker();

function promisifyStream(stream) {
    return new Promise((resolve, reject) => {
        stream.on('data', () => null);
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}

module.exports = {
    async deploy(project, file) {
        info(`Deploying container for ${project.name}...`);

        const tempDir = await fs.mkdtemp(join(tmpdir(), `${uuid()}-`));
        const archivePath = join(tempDir, file.name);

        await file.mv(archivePath);
        await decompress(archivePath, tempDir);

        // build image
        await fs.copyFile(join(__dirname, '..', 'runtime', project.runtime.toLowerCase(), 'Dockerfile'), join(tempDir, 'Dockerfile'));
        const buildStream = await docker.buildImage({ context: tempDir }, { t: `${project.id}:latest` });
        await promisifyStream(buildStream);

        // launch container
        const container = await docker.createContainer({
            name: project.id,
            Image: `${project.id}:latest`,
            ExposedPorts: { '80/tcp': {} },
            HostConfig: {
                PortBindings: {
                    '80/tcp': [
                        {
                            HostIp: '',
                            HostPort: '',
                        },
                    ],
                },
            },
        });
        await container.start();
        const containerData = await container.inspect();
        const addr = containerData.NetworkSettings.Ports['80/tcp'][0];

        // update project
        project.port = addr.HostPort;
        await project.save();
    },
    async destroy(project) {
        info(`Destroying container for ${project.name}...`);

        // delete container
        const container = await docker.getContainer(project.id);
        await container.stop();
        await container.remove();

        // delete image
        const image = await docker.getImage(`${project.id}:latest`);
        await image.remove();

        // update project
        project.port = null;
        await project.save();
    },
};
