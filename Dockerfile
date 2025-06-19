# Use the official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy project files
COPY . .

# Install dependencies
RUN pnpm install

# Build the Next.js app
RUN pnpm build

# Expose the port used by the server
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]
