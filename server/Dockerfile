FROM node:8

RUN npm install -g cnpm --registry=http://registry.npm.taobao.org
RUN npm install -g nodemon --registry=http://registry.npm.taobao.org

RUN mkdir -p /app

WORKDIR /app

COPY ./package.json /home
#COPY ./npm-shrinkwrap.json /home

WORKDIR /home

RUN npm install --registry=http://registry.npm.taobao.org

ENV NODE_PATH=/home/node_modules

WORKDIR /app

EXPOSE 8002

CMD ["nodemon", "-L", "/app/src/index.js"]
