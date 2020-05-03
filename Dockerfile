FROM node:lts-alpine

RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /app

COPY package.json /app

COPY package-lock.json /app

RUN npm install

COPY . /app

EXPOSE 3001

CMD [ "node", "server.js" ]