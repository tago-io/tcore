FROM node:16.14.0

ENV TCORE_VERSION=v0.3.2

RUN mkdir -p /root/.tagocore/Plugins/mysql

RUN mkdir -p /root/.tagocore/PluginFiles/1e60f4da9d946c0561f9dc288943fe0c

RUN apt-get update -qq && apt-get install -y wget curl

RUN wget https://downloads.tagocore.com/$TCORE_VERSION/tagocore-$TCORE_VERSION-linux-x64.tar.gz -O tcore.tar.gz

RUN wget https://downloads.tagocore.com/dev-internal-tests/tagocore-dev-linux-x64.tar.gz -O tcore.tar.gz

RUN tar -xzf tcore.tar.gz && rm tcore.tar.gz

ENV PATH="/tagocore:${PATH}"

WORKDIR /root/.tagocore/Plugins/mysql

RUN node --version

RUN npm --version

COPY package.json .

RUN npm i

COPY . .

RUN cp plugin-settings-test.yml /root/.tagocore/PluginFiles/1e60f4da9d946c0561f9dc288943fe0c/settings.yml

RUN npm run build

WORKDIR /

CMD ["./tagocore"]
