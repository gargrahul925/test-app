# Test App

## Setup

 - git clone [https://github.com/gargrahul925/test-app](https://github.com/gargrahul925/test-app)
 - cd test-app
 - docker-compose up

## Test Execution

 - npm run test-watch

## Tech Stack

 - NodeJS
 - ExpressJS
 - MongoDB
 - Redis
 - Mongoose

## Notes

 1. Setup is done with the help of docker (to avoid setup of redis and mongo on machine).
 2. I have skipped unit testing. 
 3. Integration tests are written with `jest` testing framework.
 4. Exception logging is implemented.
 5. Linting is implemented via eslint and airbnb
