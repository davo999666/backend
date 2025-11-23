# Dockerfile
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build arguments (passed from GitHub Actions)
ARG ADMIN_PASSWORD
ARG DB_PORT
ARG DB_URL
ARG EMAIL_PASS
ARG EMAIL_USER
ARG PORT

# Set environment variables inside the container
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
ENV DB_PORT=$DB_PORT
ENV DB_URL=$DB_URL
ENV EMAIL_PASS=$EMAIL_PASS
ENV EMAIL_USER=$EMAIL_USER
ENV PORT=$PORT

# Run tests during build (optional)
RUN npm test

# Expose app port
EXPOSE $PORT

# Command to run the server
CMD ["node", "server.js"]
