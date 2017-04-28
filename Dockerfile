# We will start with the official base image of Node
# This is because it comes with Node & NPM ready to go (almost)
# The `argon` bit means to grab the Node image that has the LTS version
FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000 80
CMD [ "npm", "start" ]
