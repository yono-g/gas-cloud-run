FROM node:slim

WORKDIR /app

COPY package*.json ./

RUN npm i --only=production

COPY . ./

CMD ["node", "index.js"]
