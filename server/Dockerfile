FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "bin/wwwAPI"]