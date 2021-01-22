# Web App

A Next.js application for the web application of Admin Panel .

## Getting started

### Pre-requisites

The following must be installed locally in order to run the web application:

- yarn (https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- node (https://nodejs.org/en/download/)

### Host file

Add the following line to your `/etc/hosts` file in order to alias your localhost to local.app.nextgraphqladmin.com:

```text
127.0.0.1 local.app.nextgraphqladmin.com
```
### Cloudinary setup and adding upload preset

- Cloudinary is a cloud-based image and video hosting service
- Signup for cloudinary using this [link](https://cloudinary.com/signup)
- Watch this [video about setting up upload preset in cloudinary](https://vimeo.com/454599719)


### Environment variables

```bash
IMAGE_UPLOAD_URL=https://api.cloudinary.com/v1_1/REPLACE_USER_NAME/image/upload
IMAGE_UPLOAD_PRESET=YOUR_PROJECT_NAME
```

Local environment variables are configured in the `.env` file. Variables set for the `dev` and `prod` environment are configured using the NOW CLI in the `now.json` and `now.prod.json` file. Environment variables are injected into the Next.js app through the `nex.config.js` file.

### Starting the server
(Don't delete `yarn.lock` file. Install with `yarn`)
```bash
yarn # Install all dependencies
yarn dev # Starts the development server at http://local.app.nextgraphqladmin.com:3000
```

## Local deployments to Zeit Now

In order to deploy to Zeit Now with the `yarn deploy:dev` or `yarn deploy:prod` commands, it's required to have a `now.env.dev` or `now.env.prod` file with the correct environment variables for `NOW_ORG_ID` and `NOW_PROJECT_ID`.
