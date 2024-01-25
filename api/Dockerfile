ARG NODE_IMAGE_TAG=20-alpine

###############################
# BUILD FOR LOCAL DEVELOPMENT #
###############################

FROM node:$NODE_IMAGE_TAG AS development

EXPOSE ${APP_PORT}

WORKDIR /usr/src/app

COPY --chown=node:node package.json yarn.lock ./

# https://github.com/nodejs/docker-node/issues/384#issuecomment-305208112
RUN apk --no-cache add --virtual builds-deps build-base python3 && \
  yarn install --immutable && \
  apk del builds-deps

# Bundle app source
COPY --chown=node:node . .
RUN chmod -R 777 ./

USER node

########################
# BUILD FOR PRODUCTION #
########################

FROM node:$NODE_IMAGE_TAG AS build

# Set NODE_ENV environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/app

COPY --chown=node:node ../package.json yarn.lock ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=development /usr/src/app/dist ./dist
COPY --chown=node:node .. .

RUN yarn build

RUN yarn install && yarn cache clean --all

USER node


##############
# PRODUCTION #
##############

FROM node:${NODE_IMAGE_TAG} AS production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/package.json ./

USER node

CMD [ "yarn", "start:prod" ]
