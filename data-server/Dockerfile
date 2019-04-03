FROM node:10.15.3-alpine as builder
WORKDIR /usr/app
COPY ./package*.json ./
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
    && npm ci \
    && apk del .gyp

USER node
COPY --chown=node:node ./ ./
COPY --chown=node:node ./uploads/upload_caa5009a8983a4df91ef0e3f9c8ad14a.json ./uploads
EXPOSE 3535
CMD ["node", "index.js"]