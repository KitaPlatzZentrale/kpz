# Kitaplatz-Zentrale

## Getting Started
To explore the features of Kitaplatz-Zentrale, simply visit our website at https://kitaplatz-zentrale.de/.


<h2>Introduction</h2>
<p>
In big cities like Berlin it is a struggle to find a Kindergarten both for the parents who have to start applying for the Kindergarten even before the child is born and the kindergartens who are being flooded with calls and visits from parents even when they are already full. 
Furthermore many parents have some requirements towards the kindergarten starting with distance but also more specific things like bilingual, raising concepts etc. 
The Kindergarten also not just accepts any child that comes but rather picks children according to their age, gender etc. so that there is a good distribution of children present at all times.
This process is tedious and not optimal. We want to solve it by building a Kitaplatz-zentrale, an online platform that lets parents search for Kindergarten that match their requirements and apply there in the fastest way possible.
Kindergarten will then be able to accept the children they want in a convenient way.
</p>

<h2>Architectural design</h2>

![KPZ-Cloud Architecture + CD _ CD - CI _ CD   Current Design (5)](https://github.com/KitaPlatzZentrale/kpz/assets/32839416/73f30d25-c62b-45ae-9042-7b057787632c)

- API: This Service acts as a Gateway, handles incoming requests, writes and fetches data from and to the MongoDB. It also handles the logic of the location-service. ( Can be decoupled in the future )

- AWS EventBridge: This Service consumes events emitted by the MongoDB and triggers various Lambda functions based on different event types.
 
- EmailSignup: This Service integrates with AWS Simple Email Service (SES) and consists of multiple Lambda functions responsible for sending different types of emails like signupForAreaService.
 
- SlackNotificationService: This Service handles the SNS (Simple Notification Service) integration. It includes two Lambda function triggered by SNS notifications one for errors and one for signups and sends messages to Slack.
 
- Health Check Service: This Service is a scheduled Lambda function that periodically calls the /health endpoint of the API. In case of a 503 response, it sends an SNS event, triggering the Lambda function responsible for sending a Slack message.


## Setup

You need env variables and [mongoDB setup for local development](https://www.mongodb.com/docs/manual/installation/). 
To get the env variables please contact one of the main contributor.

### Backend

```
cd backend
npm i
npx tsc --watch
npm run local
```

### Frontend
```
yarn
yarn dev
```

### Email 
```
yarn 
yarn build
```

### Notification 
```
yarn
yarn build
```


## [API Documentation](https://app.swaggerhub.com/apis/Darjusch/KPZ_API_DOC/1.0.0)
