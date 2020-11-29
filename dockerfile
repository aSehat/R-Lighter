FROM node:12

# Create app directory
WORKDIR /usr/src/app

RUN mkdir models
RUN mkdir middleware
RUN mkdir routes
RUN mkdir config

COPY ./models ./models
COPY ./middleware ./middleware
COPY ./routes ./routes
COPY ./config ./config
COPY ./package*.json ./
COPY ./server.js ./

RUN npm install
EXPOSE 5000
CMD ["node", "server.js"]





