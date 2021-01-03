# API

A Node.js GraphQL server built with [GraphQL Yoga](https://github.com/prisma/graphql-yoga).

## Getting started

### Pre-requisites

The following must be installed locally in order to run the api and it's backing services:

- yarn (https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- node (https://nodejs.org/en/download/)

### Host file

Add the following line to your `/etc/hosts` file in order to alias your localhost to *local.app.nextgraphqladmin.com*

```text
127.0.0.1 local.api.nextgraphqladmin.com
```
### Install Instructions

Must use **yarn** in order to use *yarn.lock*. (Do not delete `yarn.lock`)

* Open MYSQL and Create Database `next_graphql_admin`
* Open Terminal in `api` Directory and use following commands
* `yarn`
* `npx prisma migrate save --experimental`
* `npx prisma migrate up --experimental` (It will create DB Tables)
* `yarn seed` (it will create test user **admin@example.com / admin** in DB user table)

### Environment variables

Copy `.env.sample` and create `.env` file. Local environment variables are set in the `.env` file.

### Starting the server

Run the following commands to get started.

```bash
yarn dev # Starts the local api server accessible at http://local.api.nextgraphqladmin.com:4000
```

### Dealing with Stripe subscriptions

In order to handle Stripe webhooks that are triggered when a user upgrades to premium, or cancels their subscription, the Stripe CLI should be used to listen to incoming Stripe webhooks to the local server. Run `yarn stripe` to handle this. If upgrading a user to premium using a fake credit card (see the [Stripe docs](https://stripe.com/docs/billing/subscriptions/set-up-subscription#test-integration) for the card numbers that will work), it won't be possible to cancel the user subscription through the UI (it will have to be done through the Prisma GraphQL playground to access the DB directly).

Make sure that if you're running stripe locally, that you get a webhook secret by executing `yarn stripe` and copy/pasting it in the `.env` file, otherwise the API won't be able to read the stripe event.

## GraphQL Playground

Once the GraphQL API server is running, visit http://local.api.nextgraphqladmin.com:4000/ to view the GraphQL playground. The playground allows for calls to queries and mutations that have been defined in this repository.

## Prisma & Nexus

This project uses [Prisma](https://www.prisma.io/) to generate a CRUD API to interact with the back-end database. Nexus is used to generate a fully typed back-end API.

```bash
yarn generate # Generates the prisma API, API graphql schema, and API types
yarn generate:prisma # Generates the prisma API
yarn generate:nexus # Generates a graphql schema and types for the API
```
