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

### Problems

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

## Deployment

### Requirements

- [ ] Install PM2 on the server (used [this tutorial](https://medium.com/monstar-lab-bangladesh-engineering/deploying-node-js-apps-in-amazon-linux-with-pm2-7fc3ef5897bb))

## AWS

### SSH to EC2 Instance

```bash
ssh -i "~/.ssh/kpz-node-express-ec2-key.pem" ec2-user@ec2-3-70-176-52.eu-central-1.compute.amazonaws.com
````
