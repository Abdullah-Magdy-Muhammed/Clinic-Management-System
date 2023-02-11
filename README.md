# Clinic-Management-System
> ### Example Node (Express + Mongoose) codebase containing real world examples (CRUD,filter, sort ,auth, advanced patterns, etc) that adheres to the [RealWorld](https://github.com/gothinkster/realworld-example-apps) API spec.

This repo is functionality complete 

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` to install all required dependencies
- Install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`
- `npm start` to start the local server


# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [express-jwt](https://github.com/auth0/express-jwt) - Middleware for validating JWTs for authentication
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [mongoose-unique-validator](https://github.com/blakehaswell/mongoose-unique-validator) - For handling unique validation errors in Mongoose. Mongoose only handles validation at the document level, so a unique index across a collection will throw an exception at the driver level. The `mongoose-unique-validator` plugin helps us by formatting the error like a normal mongoose `ValidationError`.
- [passport](https://github.com/jaredhanson/passport) - For handling user authentication
- [slug](https://github.com/dodo/node-slug) - For encoding titles into a URL-friendly format
- [bycrpt](https://www.npmjs.com/package/bcrypt) - For to store password encrypted
- [auto increment](https://www.npmjs.com/package/mongoose-auto-increment) - to generate auto increment id instead of mongoosne object id

## Application Structure

- `app.js` - The entry point to our application. This file defines our express server and connects it to MongoDB using mongoose. It also requires the routes and models we'll be using in the application.
- `config/` - This folder contains configuration for passport as well as a central location for configuration/environment variables.
- `routes/` - This folder contains the route definitions for our API.
- `models/` - This folder contains the schema definitions for our Mongoose models.
- `middlewares/` - This folder contains the guard of project to deal with server.
- `utils/` - This folder contains functions we use it in different places in project.

## Error Handling

In `routes/api/index.js`, we define a error-handling middleware for handling Mongoose's `ValidationError`. This middleware will respond with a 422 status code and format the response to have [error messages the clients can understand](https://github.com/gothinkster/realworld/blob/master/API.md#errors-and-status-codes)

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define two express middlewares in `routes/auth.js` that can be used to authenticate requests. The `required` middleware configures the `express-jwt` middleware using our application's secret and will return a 401 status code if the request cannot be authenticated. The payload of the JWT can then be accessed from `req.payload` in the endpoint. The `optional` middleware configures the `express-jwt` in the same way as `required`, but will *not* return a 401 status code if the request cannot be authenticated.

## Contributors
- [@Ahmed Shams](https://github.com/Ahhmedshams)
- [@Abdullah Magdy](https://github.com/Zaazou)
- [@Ahmed Elagezy](https://github.com/ahmed-elagezy)
- [@Eman Gomaa](https://github.com/eman12go)
- [@Sohila Elhakeem](https://github.com/sohailaalhakim)
- [@Ahmed Momen](https://github.com/MOmenx0)

<br />
This pic for project's Endpoints from Postman (https://user-images.githubusercontent.com/56775516/218233530-1edf86b0-c879-49c2-afc0-876daaac592e.png)
