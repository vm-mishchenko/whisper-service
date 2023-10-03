FROM node:20-alpine3.17

# Install Web server app
WORKDIR /usr/src/whisper

# Copy compiled app
COPY ./dist ./dist

# Install runtime dependencies
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

# Default port that web server listens to
EXPOSE 3000

# starts Web server
CMD ["npm", "start"]