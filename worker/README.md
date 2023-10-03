# Whisper worker

Worker is a long-running process that:
- reads the next audio to transcribe from `AWS SQS` queue
- transcribes audio using `whisper` binary
- saves transcription into `MongoDB` Atlas cluster


## Local development


### Set up
- create AWS account
- create AWS API keys
- create SQS queue
- install dependencies

**Install nodejs dependencies**
```shell
cd shared-packages && npm i
cd worker && npm i
```

**Install whisper**
```shell
# whisper expects min Python 3.8.0 (/usr/bin/python3)

# Create environment
python3 -m venv venv

# activate env
source venv/bin/activate

# install openai-whisper and other deps
python -m pip install -r requirements.txt

# check whisper installed
which whisper

# check whisper works
whisper --help
```


### Run locally
```shell
npm run dev
```

**Configuration**
- env variables defined in `.env` file

**Environment variables**
```shell
AWS_ACCESS_KEY=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_SQS_QUEUE_URL=xxx
SLEEP_IN_SEC=xxx
WHISPER_BINARY_PATH=xxx
MONGODB_CLUSTER=xxx
MONGODB_USER=xxx
MONGODB_PASSWORD=xxx
MONGODB_ARTIFACTS_DATABASE_NAME=xxx
MONGODB_ARTIFACTS_COLLECTION_NAME=xxx
```

### Run locally in Docker
- don't provide `WHISPER_BINARY_PATH` env for Docker, it's baked into image itself

```shell
# Build worker image
npm run build && \
docker image build --tag whisper-worker:latest .

# Run worker image
docker run --init \
--env AWS_SQS_QUEUE_URL=xxx \
--env AWS_ACCESS_KEY=xxx \
--env AWS_SECRET_ACCESS_KEY=xxx \
--env SLEEP_IN_SEC=xxx \
--env MONGODB_CLUSTER=xxx \
--env MONGODB_USER=xxx \
--env MONGODB_PASSWORD=xxx \
--env MONGODB_ARTIFACTS_DATABASE_NAME=xxx \
--env MONGODB_ARTIFACTS_COLLECTION_NAME=xxx \
whisper-worker:latest
```
