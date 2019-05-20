FROM node:10-alpine AS build
ARG NODE_ENV=production
WORKDIR /minazuki

RUN apk -U upgrade && apk add \
    git \
    make \
    gcc \
    g++ \
    python \
    yarn \
 && rm -rf /var/cache/apk/*

COPY package.json yarn.lock /minazuki/

RUN yarn --pure-lockfile \
 && yarn cache clean
COPY . /minazuki/
RUN yarn run build

FROM node:9-alpine AS production
ARG NODE_ENV=production
WORKDIR /minazuki

RUN apk -U upgrade && apk add \
    ffmpeg \
    yarn \
  && rm -rf /var/cache/apk/*

COPY --from=build /minazuki/dist         /minazuki/dist
COPY --from=build /minazuki/node_modules /minazuki/node_modules
COPY --from=build /minazuki/package.json /minazuki/package.json

EXPOSE 3000
CMD yarn start
