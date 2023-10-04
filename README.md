# Whisper service

Transcribe audio via API.

Service consists of `app` and `worker`:
- `App` exposes endpoints to return and schedule audio transcription
- `Worker` transcribes the audio and saves transcription to MongoDB

Demo: https://whisper-app-b4lxkp5rjq-uc.a.run.app

**Audio examples**
- short: https://whisper-app-b4lxkp5rjq-uc.a.run.app/api/audio/?url=https://eslyes.com/easydialogs/audio/dailylife013.mp3
- long:  https://whisper-app-b4lxkp5rjq-uc.a.run.app/api/audio/?url=https://media.casted.us/115/fbc19b67.mp3
