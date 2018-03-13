FROM node:8

RUN npm install -g cnpm --registry=http://registry.npm.taobao.org

RUN mkdir -p /app
# RUN mkdir -p /app-data

WORKDIR /app

# COPY ./package.json /app-data
#COPY ./npm-shrinkwrap.json /home

# WORKDIR /app-data

ENV PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/

RUN yarn config set registry https://registry.npm.taobao.org
# RUN yarn install

# ENV PATH=$PATH:/app-data/node_modules/.bin
# ENV NODE_PATH=/app-data/node_modules

WORKDIR /app

EXPOSE 8001
