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
