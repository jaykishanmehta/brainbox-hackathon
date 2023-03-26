# BE-Singularity-Hackathon

Setup:
  Prerequisites:
    NodeJS version v14.17.0
    NPM version 6.14.13
    An AWS account with Rekognition, S3 and DynamoDB access

In aws Dynamo DB keep below table created with `id` as primary key 

 `floor_plan_and_presence`

AWS S3 following bucket should be present :
  `singularity-hackathon`
  
Env setup:
add below to .env file at root of project:
    AWS_ACCESS_KEY_ID=<aws acccess key>
    AWS_ACCESS_SECRET_TOKEN=<Aws access secret token>
    
How to run:
  After cloning this repo, run below commands:
    npm install
    node app.js