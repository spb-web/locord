FROM node:20.18-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

COPY . ./

RUN apk update &&\
    apk add g++ make python3 py3-pip build-base libtool automake ffmpeg &&\
    npm install -g pnpm

USER node
RUN pnpm install && pnpm build

COPY --chown=node:node . .

CMD [ "node", "dist/bot.js" ]

EXPOSE 3000
