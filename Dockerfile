# Dockerfile
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Optional: Build arguments (can pass if needed, but ENV will be set at runtime)
ARG ADMIN_PASSWORD
ARG DB_PORT
ARG DB_URL
ARG EMAIL_PASS
ARG EMAIL_USER
ARG PORT

# Expose the app port (default 3000 if PORT not set at runtime)
EXPOSE ${PORT:-3000}

# Start the application
CMD ["node", "server.js"]
