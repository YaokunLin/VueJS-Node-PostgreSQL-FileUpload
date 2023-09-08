# Use the official Node.js image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY api/package*.json ./

# Install the application's dependencies
RUN npm install

# Copy the rest of the application's files to the working directory
COPY api/ ./

# Specify the command to run the application
CMD ["npm", "start"]
