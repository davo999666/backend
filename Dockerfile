# Dockerfile
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Run tests during build
RUN npm test

# Expose port
EXPOSE 3000

# Command to run your server
CMD ["node", "server.js"]
