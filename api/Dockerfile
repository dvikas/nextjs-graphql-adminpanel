FROM node:12.16.1-alpine3.11

# Need to install glib for Prisma 2: https://github.com/prisma/prisma/issues/702#issuecomment-569778198
ENV GLIBC_VERSION 2.30-r0
# Download and install glibc
RUN apk add --update curl && \
  curl -Lo /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
  curl -Lo glibc.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk" && \
  curl -Lo glibc-bin.apk "https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk" && \
  apk add glibc-bin.apk glibc.apk && \
  /usr/glibc-compat/sbin/ldconfig /lib /usr/glibc-compat/lib && \
  echo 'hosts: files mdns4_minimal [NOTFOUND=return] dns mdns4' >> /etc/nsswitch.conf && \
  apk del curl && \
  rm -rf glibc.apk glibc-bin.apk /var/cache/apk/*

RUN apk add --no-cache python make g++

ARG API_AWS_ACCESS_KEY_ID
ARG API_AWS_ACCESS_KEY
ARG API_AWS_BUCKET_NAME
ARG PRISMA_ENDPOINT
ARG COMMON_FRONTEND_URL
ARG COMMON_BACKEND_URL
ARG API_COOKIE_DOMAIN
ARG API_GOOGLE_CLIENT_ID
ARG API_GOOGLE_CLIENT_SECRET
ARG API_APP_SECRET
ARG API_PORT
ARG API_STRIPE_API_KEY
ARG COMMON_STRIPE_YEARLY_PLAN_ID
ARG COMMON_STRIPE_MONTHLY_PLAN_ID
ARG API_STRIPE_WEBHOOK_SECRET
ARG API_CLOUDFRONT_DOMAIN
ARG API_AMPLITUDE_API_KEY
ARG API_DATABASE_URL

EXPOSE $API_PORT

# Set environment variables
ENV API_AWS_ACCESS_KEY_ID $API_AWS_ACCESS_KEY_ID
ENV API_AWS_ACCESS_KEY $API_AWS_ACCESS_KEY
ENV API_AWS_BUCKET_NAME $API_AWS_BUCKET_NAME
ENV COMMON_FRONTEND_URL $COMMON_FRONTEND_URL
ENV COMMON_BACKEND_URL $COMMON_BACKEND_URL
ENV API_COOKIE_DOMAIN $API_COOKIE_DOMAIN
ENV API_GOOGLE_CLIENT_ID $API_GOOGLE_CLIENT_ID
ENV API_GOOGLE_CLIENT_SECRET $API_GOOGLE_CLIENT_SECRET
ENV API_APP_SECRET $API_APP_SECRET
ENV API_PORT $API_PORT
ENV API_STRIPE_API_KEY $API_STRIPE_API_KEY
ENV COMMON_STRIPE_YEARLY_PLAN_ID $COMMON_STRIPE_YEARLY_PLAN_ID
ENV COMMON_STRIPE_MONTHLY_PLAN_ID $COMMON_STRIPE_MONTHLY_PLAN_ID
ENV API_STRIPE_WEBHOOK_SECRET $API_STRIPE_WEBHOOK_SECRET
ENV API_CLOUDFRONT_DOMAIN $API_CLOUDFRONT_DOMAIN
ENV API_AMPLITUDE_API_KEY $API_AMPLITUDE_API_KEY
ENV API_DATABASE_URL $API_DATABASE_URL

# Setup working directory. All the paths will be relative to WORKDIR
WORKDIR /usr/src/app

# Copy all source files into docker container
COPY . .

# Install dependencies and generate prisma client
RUN yarn

# Run the app
CMD [ "yarn", "start" ]