# Build stage: Use the official Node.js image as a base image
FROM node:14 AS build

# Set the working directory in the builder
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY app/package*.json ./

# Install the application's dependencies
RUN npm install

# Copy the rest of the application's files to the working directory
COPY app/ ./

# Build the Vue.js application
RUN npm run build

# Serve stage: Use the Nginx image to serve the built Vue.js app
FROM nginx:alpine

# Copy the built files from the build stage to the nginx html directory
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
