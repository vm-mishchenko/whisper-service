FROM nikolaik/python-nodejs:python3.9-nodejs18-slim

# Install whisper dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Install Whisper (https://github.com/openai/whisper)
RUN pip install openai-whisper

# Download whisper model file
RUN whisper --model tiny.en dummy.wav; exit 0

# Install Web server app
WORKDIR /usr/src/whisper

# Copy compiled worker
COPY ./dist ./dist

# Install runtime dependencies
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

# starts worker
CMD ["npm", "start"]
