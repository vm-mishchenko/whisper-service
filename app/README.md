# Whisper app
App is a web server that:
- exposes api that returns transcription for requested audio
- schedules transcription

Demo: https://whisper-app-b4lxkp5rjq-uc.a.run.app

**Audio examples**
- short: https://whisper-app-b4lxkp5rjq-uc.a.run.app/api/audio?url=https://eslyes.com/easydialogs/audio/dailylife013.mp3
- long: https://whisper-app-b4lxkp5rjq-uc.a.run.app/api/audio?url=https://media.casted.us/115/fbc19b67.mp3


## Local development


### Set up
**Install nodejs dependencies**
```shell
cd shared-packages && npm i
cd app && npm i
```


### Run locally
```shell
npm run dev
```

**Configuration**
- env variables defined in `.env` file

**Environment variables**
```shell
MONGODB_CLUSTER=xxx
MONGODB_USER=atlas-xxx
MONGODB_PASSWORD=xxx
MONGODB_ARTIFACTS_DATABASE_NAME=xxx
MONGODB_ARTIFACTS_COLLECTION_NAME=xxx
AUDIO_PROCESSING_STALE_TIME_IN_HOURS=xxx
ADMIN_ACCESS_TOKEN=xxx
```

### Run locally in Docker
```shell
# Build amd64 image. GCP doesn't support ARM images yet.
npm run build && \
docker build --platform=linux/amd64 --tag gcr.io/podcasts-search-project/whisper-app:latest .

# Run image locally 
docker run --init \
--publish 3000:3000 \
--env MONGODB_CLUSTER=xxx \
--env MONGODB_USER=xxx \
--env MONGODB_PASSWORD=xxx \
--env MONGODB_ARTIFACTS_DATABASE_NAME=xxx \
--env MONGODB_ARTIFACTS_COLLECTION_NAME=xxx \
--env AUDIO_PROCESSING_STALE_TIME_IN_HOURS=xxx \
--env ADMIN_ACCESS_TOKEN=xxx \
gcr.io/podcasts-search-project/whisper-app:latest
```

## Deploy

**Deploy image to GCP Cloud Run**
```shell
# Upload image to GCP
docker push gcr.io/podcasts-search-project/whisper-app:latest

# Deploy image to GCP Cloud Run
gcloud beta run deploy whisper-app \
--image=gcr.io/podcasts-search-project/whisper-app:latest \
--allow-unauthenticated \
--port=3000 \
--min-instances=0 \
--max-instances=1 \
--platform=managed \ 
--region=us-central1 \
--memory=128Mi \
--project=podcasts-search-project \
--set-env-vars "MONGODB_CLUSTER=xxx" \
--set-env-vars "MONGODB_USER=xxx" \
--set-env-vars "MONGODB_PASSWORD=xxx" \
--set-env-vars "MONGODB_ARTIFACTS_DATABASE_NAME=xxx" \
--set-env-vars "MONGODB_ARTIFACTS_COLLECTION_NAME=xxx" \
--set-env-vars "AUDIO_PROCESSING_STALE_TIME_IN_HOURS=xxx" \
--set-env-vars "ADMIN_ACCESS_TOKEN=xxx"
```
