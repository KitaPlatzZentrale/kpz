# KPZ - Node Express Backend

## Used Software

- Node v14.20.0
- npm 8.19.3

## Setup AWS EC2 Instance

- [ ] Create EC2 Instance
- [ ] Create Security Group, make sure you can access the instance via SSH
- [ ] Create Key Pair, download the key pair and save it in a safe place
- [ ] Connect to the instance via SSH
- [ ] Install Git
- [ ] Install Node
- [ ] Install Docker
- [ ] Install Docker-Compose
- [ ] Start Docker Deamon

## Typescript

Compile typescript to javascript

```bash
npx tsc
```

Watch for changes

```bash
npx tsc --watch
```

Run dev server locally

```bash
nodemon dist/index.js
```

## AWS

### SSH to EC2 Instance

```bash
ssh -i "~/.ssh/kpz-node-express-ec2-key.pem" ec2-user@ec2-3-70-176-52.eu-central-1.compute.amazonaws.com
````

### Upload files to EC2 Instance

```bash
scp -i "~/.ssh/kpz-node-express-ec2-key.pem" -r ./dist
```

### Install Docker

```bash
sudo yum update -y
sudo yum install docker
````

### Start Docker Deamon

```bash
sudo systemctl start docker
```

### Install Docker Compose

1. ```sudo yum update -y```
2. ```sudo yum install python3-pip -y```
3. ```sudo pip3 install docker-compose```
4. Read Section problems before running this command ```sudo yum remove python3-requests -y```
5. Read Section problems before running this command ```sudo pip3 install requests```

### Problems

If 3 errors because can't uninstall request package, contuniue with 4 and 5 and then try again 3


## Datadog

### Installing Agend on EC2 Instance

```bash
docker run -d --name datadog-agent \
           --cgroupns host \
           --pid host \
           -e DD_API_KEY=$DATADOG_API_KEY \
           -e DD_LOGS_ENABLED=true \
           -e DD_LOGS_CONFIG_CONTAINER_COLLECT_ALL=true \
           -e DD_CONTAINER_EXCLUDE="name:datadog-agent" \
           -v /var/run/docker.sock:/var/run/docker.sock:ro \
           -v /var/lib/docker/containers:/var/lib/docker/containers:ro \
           -v /proc/:/host/proc/:ro \
           -v /opt/datadog-agent/run:/opt/datadog-agent/run:rw \
           -v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
           gcr.io/datadoghq/agent:latest
```

Source: <https://docs.datadoghq.com/containers/docker/log/?tab=containerinstallation#examples>

### Setting AWS up for Datadog

CloudFormation (Best for quickly getting started)
To set up the AWS integration with CloudFormation, see the the [AWS getting started guide](https://docs.datadoghq.com/getting_started/integrations/aws/).

Read: <https://docs.datadoghq.com/integrations/amazon_web_services/#installation>
