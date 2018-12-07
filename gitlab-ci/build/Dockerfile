#for gitlab-ci

FROM node:8

RUN \
  mkdir -p /app && \
  yarn global add nodemon

COPY ./server /app

WORKDIR /app
RUN \
  sed -i 's#http://registry.npm.taobao.org#https://registry.yarnpkg.com#' yarn.lock && \
  yarn

EXPOSE 80

CMD ["nodemon", "-L", "/app/src/index.js"]
