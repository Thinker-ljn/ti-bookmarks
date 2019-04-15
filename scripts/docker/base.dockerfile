FROM node:11

RUN npm config set registry https://registry.npm.taobao.org && \
    yarn config set registry https://registry.npm.taobao.org && \
    mkdir -p /app
    
ENV PHANTOMJS_CDNURL=https://npm.taobao.org/mirrors/phantomjs/ \
    TERM=xterm-256color


WORKDIR /app
EXPOSE 80

CMD ["yarn", "start"]
