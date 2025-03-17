# Stage 1: Build the application
FROM node:23-bullseye-slim AS build

WORKDIR /app
COPY . .
RUN yarn install
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN yarn build

# Stage 2: Serve the application with `serve`
FROM node:23-bullseye-slim

WORKDIR /app
COPY --from=build /app/dist ./dist

# Install serve globally
RUN yarn global add serve

EXPOSE 3000

# Serve the dist folder
CMD ["serve", "-s", "dist", "-l", "3000"]