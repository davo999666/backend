FROM node:22.15.1-alpine
LABEL authors="David"

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY ./src ./src
EXPOSE 8080

CMD ["npm", "start"]