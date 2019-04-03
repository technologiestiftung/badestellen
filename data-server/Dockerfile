FROM node:10.15.1-alpine as builder
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm ci
COPY ./ ./
EXPOSE 3535
USER node
CMD ["node", "index.js"]