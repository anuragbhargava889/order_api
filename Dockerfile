FROM node:latest
RUN mkdir -p /var/nodejs/app
WORKDIR /var/nodejs/app
COPY package.json /var/nodejs/app
RUN npm install
COPY . /var/nodejs/app
EXPOSE 8080
CMD [ "npm", "start" ]
