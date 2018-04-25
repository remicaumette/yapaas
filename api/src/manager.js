const Docker = require('dockerode');
const path = require('path');
const fs = require('fs');

const docker = new Docker();
const promisifyStream = stream => new Promise((resolve, reject) => {
    stream.on('data', () => null);
    stream.on('end', resolve);
    stream.on('error', reject);
});

module.exports.buildImage = (title, folder) => new Promise((resolve, reject) => {
    fs.copyFile(path.join(__dirname, '..', 'assets', 'Dockerfile'), path.join(folder, 'Dockerfile'), (cpError) => {
        if (cpError) {
            return reject(cpError);
        }
        docker.buildImage({ context: folder }, { t: `${title}:latest` }, (error, stream) => {
            if (error) {
                return reject(error);
            }
            promisifyStream(stream)
                .then(resolve)
                .catch(reject);
        });
    });
});

module.exports.launchProject = project => new Promise((resolve, reject) => {
    docker.createContainer({
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
    }, (createError, container) => {
        if (createError) {
            return reject(createError);
        }
        container.start((startError) => {
            if (startError) {
                return reject(startError);
            }
            container.inspect((error, data) => {
                if (error) {
                    return reject(error);
                }
                const addr = data.NetworkSettings.Ports['80/tcp'][0];
                resolve(addr.HostPort);
            });
        });
    });
});
