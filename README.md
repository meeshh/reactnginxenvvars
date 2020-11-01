# React, NGINX, Docker and Environment Variables

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Why this project?

Many of us dockerize our react applications and then attempt to serve them with an NGINX server. Howver, sometimes we have complex architetures and will want to deploy our app to multiple servers each with a different environment.

A practice by react developers is to use and leverage the environment variables to switch between different backend instances and test on multiple node environments whether it is development, staging, production, etc...
This happens often within pipelines that automate the CI/CD process.

We might think that _CREATE REACT APP_ handles environment variables like we want it to do, however, it is clears in the docs that the environment variables are embedded during the build time. This is why we cannot have our dev server running, change our .env file and expect the app to adjust on the fly. We should always restart the server. In production, we should rebuild the application. Read more about the environment variables [here]("https://create-react-app.dev/docs/adding-custom-environment-variables/").

## The problem

### Imagine the following scenario:

We pull a node image from dockerhub, use it to create a build of our app, then we pull an NGINX image from docker hub, transfer the built app to it and then bundle everything and build a unique image that when run in a container, it is supposed to serve our application.

The problem is when `yarn build` was executed in the process of the first image, create react app has already embedded environment variables. So when we have the product image at the end and decide to run it in a container with custom environment variables like so: `docker run -e "my_env_var=MY_ENV_VAL" imagename`, the react application will not be able to read `my_env_var` hence the `process.env` object inside react will only have what react puts in it as default such as the `NODE_ENV` variable.

## The solution

Since we are using NGINX as a server, we can create a route that serves the application settings then fetch them when our application loads for the first time and store them in the state or wherever we please.

To do so, we should consider creating a template json file that will hold the keys to our needed environment variables copy it to the image build, and inject the environment variables at runtime with `envsubst` in a small bash script. So what is happening is that our script creates an `appsettings.json` file based on our template and substitutes the values of the variables with the ones provided at runtime.

Inside our `app.js`, we use a `useEffect` hook to call the /appsettings route which responds with the values that we need.

The code is pretty straight forward in react.

I have committed the `.env` file as well for the example's clarity.

## Testing the solution

First of all have docker desktop installed and make sure you don't change the `Dockerfile` as the versions of both node and nginx images that are in use have already pre-installed tools such as `yarn` in case of node and `gettext` in case of nginx.

- `yarn install` in order to have the modules on your local machine so you can run the development environment

- `yarn start` in order to run the development environment

To run a production build, we shouf involve docker.

- So have your docker desktop running and open your favorite shell
- `docker build -t reactnginximage .` to build the product image (don't forget the dot at the end of the command to instruct the build where the `Dockerfile` is located)
- When the build finishes, run the product image in a container with the following command: `docker run --name reactnginxcontainer -e "REACT_APP_FIRST_VARIABLE=production first value" -e "REACT_APP_SECOND_VARIABLE=production second value" -p 4000:80/tcp reactnginximage`

This will run and serve your production build on your localhost port 4000 so when the container is running, head to your browser, navigate to `localhost:4000`

Also have your development server running with `yarn start` and head to your browser and navigate to `localhost:3000`

Now compare the two pages

![alt text](https://github.com/[meeshh]/[reactnginxenvvars]/blob/[master]/screenshot.png?raw=true)
