# Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ARG ADMIN_PASSWORD
ARG DB_PORT
ARG DB_URL
ARG EMAIL_PASS
ARG EMAIL_USER
ARG PORT

EXPOSE ${PORT:-3000}

CMD ["node", "server.js"]
