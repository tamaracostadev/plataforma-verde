FROM node:15.11.0-alpine3.12

# create destination directory
RUN mkdir -p /usr/src/plataforma-verde
WORKDIR /usr/src/plataforma-verde

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/plataforma-verde/
RUN npm install
RUN npm run build

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "npm", "start" ]