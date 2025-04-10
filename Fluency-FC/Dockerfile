FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8008

# Set environment variables
ENV PORT=8008

# Run the server
CMD ["node", "server.js"] 