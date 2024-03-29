# Use Node.js LTS (14.x) as the base image
FROM node:14-alpine AS builder

# Set build arguments with default values (optional)
ARG VITE_BACKEND_URL=http://api.kitaplatz-zentrale.de
ARG VITE_PUBLIC_HERE_API_KEY=W4Sm0s8ksnXVnfgqHit48vXtf4MvD90-TY_vH0W1Sno

# ENV
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_PUBLIC_HERE_API_KEY=${VITE_PUBLIC_HERE_API_KEY}

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the entire app to the container
COPY . .

# Build the app
RUN yarn build

# Use Nginx as the base image for the final image
FROM nginx:alpine

# Copy the build files from the previous image to the Nginx image
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
