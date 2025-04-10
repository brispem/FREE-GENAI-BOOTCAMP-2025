FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install framer-motion canvas-confetti

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 5173

# Set environment variables
ENV PORT=5173
ENV REACT_APP_API_URL=http://localhost:5174

# Run the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 