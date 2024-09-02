# Set the base image for your Node.js application
FROM node:14-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3500

CMD ["npm", "run", "build"]
