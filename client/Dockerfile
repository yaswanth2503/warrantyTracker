FROM node:24

WORKDIR /app

COPY server/package*.json ./server/

WORKDIR /app/server

RUN npm install

WORKDIR /app

COPY client ./client
COPY server ./server

ENV NODE_ENV=production

EXPOSE 8080

WORKDIR /app/server

CMD ["node", "bin/www.js"]