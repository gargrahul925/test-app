FROM node:10-alpine
# install compile  time dependencies for  opencv
RUN apk --no-cache add --virtual native-deps \
    g++ gcc libgcc libstdc++ linux-headers autoconf automake make cmake nasm git


# Installs latest Chromium (72) package.
RUN apk update && apk upgrade && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    python


# Add user so we don't need --no-sandbox.
RUN addgroup -S alpine && adduser -S -g alpine alpine \
    && chown -R alpine:alpine /home/alpine\
    && mkdir -p /home/alpine/app \
    && chown -R alpine:alpine /home/alpine/app

# Run everything after as non-privileged user.
USER alpine

WORKDIR /home/alpine/app

# install dependency
ADD package.json .
RUN npm install

CMD ["node_modules/.bin/nodemon", "-L", "--inspect=0.0.0.0:5858", "index.js"]
