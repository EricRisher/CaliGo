FROM node:18-alpine

# Install dependencies for bcrypt on Alpine
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the backend port
EXPOSE 3001

# Default command (can be overridden in docker-compose)
CMD /bin/sh -c "while ! nc -z mysql 3306; do echo 'Waiting for MySQL...'; sleep 3; done && node server.js"
